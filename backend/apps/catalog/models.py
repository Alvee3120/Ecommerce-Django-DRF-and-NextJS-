from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.core.models import SEOModel, TimeStampedModel


class Category(SEOModel, TimeStampedModel):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="children",
    )
    image = models.ImageField(upload_to="categories/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ("sort_order", "name")
        unique_together = ("parent", "name")

    def __str__(self):
        return self.name


class Attribute(models.Model):
    """e.g. Color, Size - the axis a product can vary along."""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name


class AttributeValue(models.Model):
    """e.g. Red, XL - a concrete value of an Attribute."""

    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE, related_name="values")
    value = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)

    class Meta:
        unique_together = ("attribute", "value")
        ordering = ("attribute", "value")

    def __str__(self):
        return f"{self.attribute.name}: {self.value}"


class Tag(models.Model):
    """Admin-controlled label for curating homepage collections (Featured, Best Selling, On Sale, ...)."""

    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name


class Product(SEOModel, TimeStampedModel):
    class ProductType(models.TextChoices):
        BASE = "base", "Base"
        VARIABLE = "variable", "Variable"

    class Badge(models.TextChoices):
        NONE = "", "None"
        HOT = "hot", "Hot"
        NEW = "new", "New"
        SALE = "sale", "Sale"

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    product_type = models.CharField(
        max_length=10, choices=ProductType.choices, default=ProductType.BASE
    )
    categories = models.ManyToManyField(Category, related_name="products", blank=True)
    tags = models.ManyToManyField(Tag, related_name="products", blank=True)
    sku = models.CharField(max_length=100, blank=True)
    badge = models.CharField(max_length=10, choices=Badge.choices, blank=True, default=Badge.NONE)
    average_rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        help_text="Recalculated automatically from real reviews once any exist for this product.",
    )
    review_count = models.PositiveIntegerField(default=0)

    # Only used when product_type == BASE; VARIABLE products price/stock
    # their ProductVariations individually instead.
    regular_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.PositiveIntegerField(null=True, blank=True)

    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return self.name

    def clean(self):
        errors = {}
        if self.product_type == self.ProductType.BASE:
            if self.regular_price is None:
                errors["regular_price"] = "Base products must set a regular price."
            if self.stock is None:
                errors["stock"] = "Base products must set a stock quantity."
        else:
            if self.regular_price is not None or self.discount_price is not None or self.stock is not None:
                errors["product_type"] = (
                    "Variable products set price/stock on each variation, not on the product itself."
                )
        if (
            self.discount_price is not None
            and self.regular_price is not None
            and self.discount_price >= self.regular_price
        ):
            errors["discount_price"] = "Discount price must be less than the regular price."
        if errors:
            raise ValidationError(errors)

    @property
    def effective_price(self):
        """Price to display for a BASE product; VARIABLE products have no single price."""
        if self.product_type != self.ProductType.BASE:
            return None
        return self.discount_price if self.discount_price is not None else self.regular_price

    def recalculate_rating(self):
        agg = self.reviews.aggregate(avg=models.Avg("rating"), count=models.Count("id"))
        self.review_count = agg["count"] or 0
        self.average_rating = round(agg["avg"], 1) if agg["avg"] is not None else None
        self.save(update_fields=["average_rating", "review_count"])


class ProductImage(models.Model):
    """General gallery image, not tied to any specific variation."""

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/gallery/")
    alt_text = models.CharField(max_length=255, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("sort_order", "id")

    def __str__(self):
        return f"{self.product.name} image #{self.pk}"


class ProductVariation(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variations")
    sku = models.CharField(max_length=100, blank=True)
    attribute_values = models.ManyToManyField(
        AttributeValue, related_name="variations", blank=True
    )
    regular_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to="products/variations/", blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("id",)

    def __str__(self):
        if self.pk:
            values = ", ".join(str(v) for v in self.attribute_values.all())
            if values:
                return f"{self.product.name} ({values})"
        return f"{self.product.name} variation"

    def clean(self):
        if self.discount_price is not None and self.discount_price >= self.regular_price:
            raise ValidationError(
                {"discount_price": "Discount price must be less than the regular price."}
            )

    @property
    def effective_price(self):
        return self.discount_price if self.discount_price is not None else self.regular_price


class Review(models.Model):
    """Guest-submitted review; visible immediately (no moderation queue exists elsewhere in this app either)."""

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    reviewer_name = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.reviewer_name} rated {self.product.name} {self.rating}/5"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.product.recalculate_rating()

    def delete(self, *args, **kwargs):
        product = self.product
        super().delete(*args, **kwargs)
        product.recalculate_rating()
