import django_filters
from django.db.models import Q, Sum
from django.db.models.functions import Coalesce
from rest_framework import filters, viewsets

from .models import Category, Product
from .serializers import (
    CategoryDetailSerializer,
    CategorySerializer,
    CategoryTreeSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
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
    on_sale = django_filters.BooleanFilter(method="filter_on_sale")
    min_rating = django_filters.NumberFilter(field_name="average_rating", lookup_expr="gte")

    class Meta:
        model = Product
        fields = ("category", "product_type")

    def filter_on_sale(self, queryset, name, value):
        discounted = Q(discount_price__isnull=False) | Q(
            variations__is_active=True, variations__discount_price__isnull=False
        )
        qs = queryset.filter(discounted) if value else queryset.exclude(discounted)
        return qs.distinct()


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).prefetch_related(
        "categories", "images", "variations__attribute_values__attribute"
    )
    lookup_field = "slug"
    filter_backends = (
        django_filters.rest_framework.DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    )
    filterset_class = ProductFilter
    search_fields = ("name", "description")
    ordering_fields = ("regular_price", "created_at", "name", "average_rating", "sales_count")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer

    def get_queryset(self):
        return super().get_queryset().annotate(
            sales_count=Coalesce(
                Sum("order_items__quantity", filter=~Q(order_items__order__status="cancelled")),
                0,
            )
        )
