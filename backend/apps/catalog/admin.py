from django import forms
from django.contrib import admin

from .models import (
    Attribute,
    AttributeValue,
    Category,
    Product,
    ProductImage,
    ProductVariation,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "parent", "is_active", "sort_order")
    list_filter = ("is_active", "parent")
    search_fields = ("name", "slug")
    autocomplete_fields = ("parent",)
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


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "product_type", "regular_price", "stock", "badge", "is_active")
    list_filter = ("product_type", "is_active", "badge", "categories")
    search_fields = ("name", "slug", "sku")
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("categories",)
    inlines = [ProductImageInline, ProductVariationInline]
