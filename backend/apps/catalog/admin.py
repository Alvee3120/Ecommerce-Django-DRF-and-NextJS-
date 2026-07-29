from django import forms
from django.contrib import admin

from .models import (
    Attribute,
    AttributeValue,
    Category,
    Product,
    ProductImage,
    ProductVariation,
    Review,
    Tag,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "parent", "is_active", "sort_order")
    list_filter = ("is_active", "parent")
    search_fields = ("name", "slug")
    autocomplete_fields = ("parent",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


class AttributeValueInline(admin.TabularInline):
    model = AttributeValue
    extra = 1
    prepopulated_fields = {"slug": ("value",)}


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [AttributeValueInline]


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "alt_text", "sort_order")


class ProductVariationInlineFormSet(forms.BaseInlineFormSet):
    def clean(self):
        super().clean()
        seen_combinations = []
        for form in self.forms:
            if not hasattr(form, "cleaned_data") or form.cleaned_data.get("DELETE"):
                continue
            attribute_values = form.cleaned_data.get("attribute_values")
            if attribute_values is None:
                continue
            combo = frozenset(v.pk for v in attribute_values)
            if combo in seen_combinations:
                raise forms.ValidationError(
                    "Two variations cannot share the same combination of attribute values."
                )
            seen_combinations.append(combo)


class ProductVariationInline(admin.TabularInline):
    model = ProductVariation
    formset = ProductVariationInlineFormSet
    extra = 1
    fields = (
        "sku",
        "attribute_values",
        "regular_price",
        "discount_price",
        "stock",
        "image",
        "is_active",
    )
    filter_horizontal = ("attribute_values",)


class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    fields = ("reviewer_name", "rating", "comment", "created_at")
    readonly_fields = fields

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "product_type",
        "regular_price",
        "stock",
        "badge",
        "average_rating",
        "review_count",
        "is_active",
    )
    list_filter = ("product_type", "is_active", "badge", "categories", "tags")
    search_fields = ("name", "slug", "sku")
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("categories", "tags")
    readonly_fields = ("review_count",)
    inlines = [ProductImageInline, ProductVariationInline, ReviewInline]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "reviewer_name", "rating", "created_at")
    list_filter = ("rating",)
    search_fields = ("reviewer_name", "product__name")
    autocomplete_fields = ("product",)
