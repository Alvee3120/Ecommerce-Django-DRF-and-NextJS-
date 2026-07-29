import django_filters
from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Product
from .serializers import (
    CategoryDetailSerializer,
    CategorySerializer,
    CategoryTreeSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    ReviewCreateSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    lookup_field = "slug"
    filterset_fields = ("parent", "is_active")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CategoryDetailSerializer
        if self.action == "list" and self.request.query_params.get("tree") in ("1", "true"):
            return CategoryTreeSerializer
        return CategorySerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "list" and self.request.query_params.get("tree") in ("1", "true"):
            qs = qs.filter(parent__isnull=True)
        return qs.order_by("sort_order", "name")


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="categories__slug")
    tag = django_filters.CharFilter(field_name="tags__slug")

    class Meta:
        model = Product
        fields = ("category", "tag", "product_type")


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).prefetch_related(
        "categories", "tags", "images", "variations__attribute_values__attribute"
    )
    lookup_field = "slug"
    filter_backends = (
        django_filters.rest_framework.DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    )
    filterset_class = ProductFilter
    search_fields = ("name", "description")
    ordering_fields = ("regular_price", "created_at", "name", "average_rating")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer

    @action(detail=True, methods=["post"], url_path="reviews")
    def add_review(self, request, slug=None):
        product = self.get_object()
        serializer = ReviewCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(product=product)
        detail = ProductDetailSerializer(product, context=self.get_serializer_context())
        return Response(detail.data, status=201)
