from rest_framework import viewsets

from .models import Category
from .serializers import (
    CategoryDetailSerializer,
    CategorySerializer,
    CategoryTreeSerializer,
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
