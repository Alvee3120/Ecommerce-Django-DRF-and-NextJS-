from rest_framework import serializers

from .models import (
    AttributeValue,
    Category,
    Product,
    ProductImage,
    ProductVariation,
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "slug",
            "parent",
            "image",
            "is_active",
            "sort_order",
        )


class CategoryDetailSerializer(serializers.ModelSerializer):
    children = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "slug",
            "parent",
            "image",
            "is_active",
            "sort_order",
            "meta_title",
            "meta_description",
            "children",
        )


class CategoryTreeSerializer(serializers.ModelSerializer):
    """Recursive serializer used by GET /api/categories/?tree=1."""

    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "image", "sort_order", "children")

    def get_children(self, obj):
        qs = obj.children.filter(is_active=True).order_by("sort_order", "name")
        return CategoryTreeSerializer(qs, many=True, context=self.context).data


class AttributeValueSerializer(serializers.ModelSerializer):
    attribute = serializers.CharField(source="attribute.name", read_only=True)
    attribute_slug = serializers.CharField(source="attribute.slug", read_only=True)

    class Meta:
        model = AttributeValue
        fields = ("id", "attribute", "attribute_slug", "value", "slug")


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_text", "sort_order")


class ProductVariationSerializer(serializers.ModelSerializer):
    attribute_values = AttributeValueSerializer(many=True, read_only=True)
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = ProductVariation
        fields = (
            "id",
            "sku",
            "attribute_values",
            "regular_price",
            "discount_price",
            "effective_price",
            "stock",
            "image",
            "is_active",
        )


class ProductListSerializer(serializers.ModelSerializer):
    categories = serializers.SlugRelatedField(slug_field="slug", many=True, read_only=True)
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "product_type",
            "categories",
            "regular_price",
            "discount_price",
            "effective_price",
            "stock",
            "is_active",
            "primary_image",
        )

    def get_primary_image(self, obj):
        first_image = obj.images.order_by("sort_order", "id").first()
        if not first_image:
            return None
        request = self.context.get("request")
        url = first_image.image.url
        return request.build_absolute_uri(url) if request else url


class ProductDetailSerializer(ProductListSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variations = ProductVariationSerializer(many=True, read_only=True)

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + (
            "description",
            "meta_title",
            "meta_description",
            "images",
            "variations",
        )
