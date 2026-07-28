from decimal import Decimal

from django.db import transaction
from django.db.models import F
from rest_framework import serializers

from apps.catalog.models import Product, ProductVariation

from .models import Order, OrderItem, OrderStatusHistory


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ("product_name", "variation_label", "unit_price", "quantity", "line_total")


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusHistory
        fields = ("status", "changed_at", "note")


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            "order_number",
            "status",
            "customer_name",
            "phone_number",
            "email",
            "address_line1",
            "address_line2",
            "city",
            "state_region",
            "postal_code",
            "country",
            "subtotal",
            "discount_amount",
            "total",
            "items",
            "status_history",
            "created_at",
        )


class CheckoutItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    variation_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1)


class CheckoutSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=255)
    phone_number = serializers.CharField(max_length=32)
    email = serializers.EmailField(required=False, allow_blank=True)
    address_line1 = serializers.CharField(max_length=255)
    address_line2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100)
    state_region = serializers.CharField(max_length=100, required=False, allow_blank=True)
    postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    country = serializers.CharField(max_length=100)
    items = CheckoutItemInputSerializer(many=True)

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("At least one item is required.")
        return items

    def create(self, validated_data):
        items_data = validated_data.pop("items")

        with transaction.atomic():
            resolved_items = self._resolve_items(items_data)

            subtotal = sum((item["line_total"] for item in resolved_items), Decimal("0"))

            order = Order.objects.create(
                customer_name=validated_data["customer_name"],
                phone_number=validated_data["phone_number"],
                email=validated_data.get("email", ""),
                address_line1=validated_data["address_line1"],
                address_line2=validated_data.get("address_line2", ""),
                city=validated_data["city"],
                state_region=validated_data.get("state_region", ""),
                postal_code=validated_data.get("postal_code", ""),
                country=validated_data["country"],
                subtotal=subtotal,
                discount_amount=Decimal("0"),
                total=subtotal,
            )
            order.status_history.create(status=Order.Status.PENDING)

            for resolved in resolved_items:
                OrderItem.objects.create(
                    order=order,
                    product=resolved["product"],
                    variation=resolved["variation"],
                    product_name=resolved["product_name"],
                    variation_label=resolved["variation_label"],
                    unit_price=resolved["unit_price"],
                    quantity=resolved["quantity"],
                    line_total=resolved["line_total"],
                )
                if resolved["variation"] is not None:
                    ProductVariation.objects.filter(pk=resolved["variation"].pk).update(
                        stock=F("stock") - resolved["quantity"]
                    )
                else:
                    Product.objects.filter(pk=resolved["product"].pk).update(
                        stock=F("stock") - resolved["quantity"]
                    )

            return order

    def _resolve_items(self, items_data):
        """
        Locks and re-validates every line item against the DB inside the
        caller's transaction: never trust client-submitted prices, and
        select_for_update() serializes concurrent checkouts against the
        same stock so two guests can't both buy the last unit.
        """
        resolved = []
        for item in items_data:
            product = Product.objects.select_for_update().filter(
                pk=item["product_id"], is_active=True
            ).first()
            if product is None:
                raise serializers.ValidationError(
                    f"Product {item['product_id']} is not available."
                )

            variation = None
            if product.product_type == Product.ProductType.VARIABLE:
                variation_id = item.get("variation_id")
                if not variation_id:
                    raise serializers.ValidationError(
                        f"A variation is required for '{product.name}'."
                    )
                variation = ProductVariation.objects.select_for_update().filter(
                    pk=variation_id, product=product, is_active=True
                ).first()
                if variation is None:
                    raise serializers.ValidationError(
                        f"Selected variation is not available for '{product.name}'."
                    )
                unit_price = variation.effective_price
                stock = variation.stock
                variation_label = " / ".join(
                    v.value for v in variation.attribute_values.order_by("attribute__name")
                )
            else:
                unit_price = product.effective_price
                stock = product.stock or 0
                variation_label = ""

            quantity = item["quantity"]
            if quantity > stock:
                raise serializers.ValidationError(
                    f"Only {stock} of '{product.name}' left in stock."
                )

            line_total = unit_price * quantity
            resolved.append(
                {
                    "product": product,
                    "variation": variation,
                    "product_name": product.name,
                    "variation_label": variation_label,
                    "unit_price": unit_price,
                    "quantity": quantity,
                    "line_total": line_total,
                }
            )
        return resolved
