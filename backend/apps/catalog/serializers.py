from django.db.models import Count
from rest_framework import serializers

from .models import (
    AttributeValue,
    Category,
    Product,
    ProductImage,
    ProductVariation,
    Review,
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
    tags = serializers.SlugRelatedField(slug_field="slug", many=True, read_only=True)
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    primary_image = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    colors = serializers.SerializerMethodField()
    sizes = serializers.SerializerMethodField()
    starting_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "product_type",
            "categories",
            "tags",
            "regular_price",
            "discount_price",
            "effective_price",
            "starting_price",
            "stock",
            "is_active",
            "badge",
            "average_rating",
            "primary_image",
            "images",
            "colors",
            "sizes",
        )

    def get_primary_image(self, obj):
        first_image = obj.images.order_by("sort_order", "id").first()
        if not first_image:
            return None
        request = self.context.get("request")
        url = first_image.image.url
        return request.build_absolute_uri(url) if request else url

    def _active_variations(self, obj):
        return [v for v in obj.variations.all() if v.is_active]

    def _attribute_values(self, obj, attribute_name):
        seen = {}
        for variation in self._active_variations(obj):
            for av in variation.attribute_values.all():
                if av.attribute.name.lower() == attribute_name and av.value not in seen:
                    seen[av.value] = True
        return list(seen.keys())

    def get_colors(self, obj):
        return self._attribute_values(obj, "color")

    def get_sizes(self, obj):
        return self._attribute_values(obj, "size")

    def get_starting_price(self, obj):
        if obj.product_type == Product.ProductType.BASE:
            return None
        prices = [v.effective_price for v in self._active_variations(obj)]
        return min(prices) if prices else None


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ("id", "reviewer_name", "rating", "comment", "created_at")


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ("reviewer_name", "rating", "comment")


class ProductDetailSerializer(ProductListSerializer):
    variations = ProductVariationSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    rating_breakdown = serializers.SerializerMethodField()
    previous_slug = serializers.SerializerMethodField()
    next_slug = serializers.SerializerMethodField()

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + (
            "description",
            "meta_title",
            "meta_description",
            "variations",
            "review_count",
            "reviews",
            "rating_breakdown",
            "previous_slug",
            "next_slug",
        )

    def get_rating_breakdown(self, obj):
        counts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
        for row in obj.reviews.values("rating").annotate(count=Count("id")):
            counts[row["rating"]] = row["count"]
        return counts

    def get_previous_slug(self, obj):
        prev = (
            Product.objects.filter(is_active=True, created_at__gt=obj.created_at)
            .order_by("created_at")
            .first()
        )
        return prev.slug if prev else None

    def get_next_slug(self, obj):
        nxt = (
            Product.objects.filter(is_active=True, created_at__lt=obj.created_at)
            .order_by("-created_at")
            .first()
        )
        return nxt.slug if nxt else None
