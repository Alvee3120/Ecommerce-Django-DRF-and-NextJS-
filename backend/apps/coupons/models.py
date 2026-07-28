from decimal import Decimal, ROUND_HALF_UP

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class Coupon(models.Model):
    class DiscountType(models.TextChoices):
        FLAT = "flat", "Flat amount"
        PERCENTAGE = "percentage", "Percentage"

    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=10, choices=DiscountType.choices)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    usage_limit = models.PositiveIntegerField(
        null=True, blank=True, help_text="Leave blank for unlimited uses."
    )
    used_count = models.PositiveIntegerField(default=0, editable=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return self.code

    def save(self, *args, **kwargs):
        self.code = self.code.upper().strip()
        super().save(*args, **kwargs)

    def clean(self):
        if self.discount_value is not None and self.discount_value <= 0:
            raise ValidationError({"discount_value": "Discount value must be greater than zero."})
        if self.discount_type == self.DiscountType.PERCENTAGE and self.discount_value and self.discount_value > 100:
            raise ValidationError({"discount_value": "Percentage discount cannot exceed 100."})

    def validate_for_amount(self, subtotal):
        """
        Central coupon-eligibility check, reused by both the standalone
        validate endpoint and checkout so the rules can't drift between
        the two call sites. Returns (is_valid, discount_amount, message).
        """
        if not self.is_active:
            return False, Decimal("0.00"), "This coupon is not active."
        if self.expiry_date and self.expiry_date < timezone.now():
            return False, Decimal("0.00"), "This coupon has expired."
        if self.usage_limit is not None and self.used_count >= self.usage_limit:
            return False, Decimal("0.00"), "This coupon has reached its usage limit."
        if self.min_order_amount is not None and subtotal < self.min_order_amount:
            return (
                False,
                Decimal("0.00"),
                f"Minimum order amount for this coupon is {self.min_order_amount}.",
            )

        if self.discount_type == self.DiscountType.FLAT:
            discount = min(self.discount_value, subtotal)
        else:
            discount = (subtotal * self.discount_value / Decimal("100")).quantize(
                Decimal("0.01"), rounding=ROUND_HALF_UP
            )
            discount = min(discount, subtotal)

        return True, discount, "Coupon applied."
