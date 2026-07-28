import uuid

from django.db import models


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PROCESSING = "processing", "Processing"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"

    # cancelled is only reachable while an order hasn't shipped yet.
    ALLOWED_TRANSITIONS = {
        Status.PENDING: {Status.PROCESSING, Status.CANCELLED},
        Status.PROCESSING: {Status.SHIPPED, Status.CANCELLED},
        Status.SHIPPED: {Status.DELIVERED},
        Status.DELIVERED: set(),
        Status.CANCELLED: set(),
    }

    order_number = models.CharField(max_length=20, unique=True, editable=False)

    customer_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=32)
    email = models.EmailField(blank=True)

    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state_region = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100)

    status = models.CharField(max_length=12, choices=Status.choices, default=Status.PENDING)

    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return self.order_number

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def set_status(self, new_status, note=""):
        """
        The only sanctioned way to change status: validates the transition
        and writes the OrderStatusHistory row in the same call, so the two
        can never drift apart.
        """
        if new_status == self.status:
            return
        allowed = self.ALLOWED_TRANSITIONS.get(self.status, set())
        if new_status not in allowed:
            raise ValueError(f"Cannot transition order from '{self.status}' to '{new_status}'.")
        self.status = new_status
        self.save(update_fields=["status", "updated_at"])
        self.status_history.create(status=new_status, note=note)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        "catalog.Product",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="order_items",
    )
    variation = models.ForeignKey(
        "catalog.ProductVariation",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="order_items",
    )

    # Snapshots: catalog data can change or be deleted after the order is
    # placed, but the order must keep showing what the customer actually paid.
    product_name = models.CharField(max_length=255)
    variation_label = models.CharField(max_length=255, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    line_total = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ("id",)

    def __str__(self):
        return f"{self.quantity} x {self.product_name}"


class OrderStatusHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="status_history")
    status = models.CharField(max_length=12, choices=Order.Status.choices)
    changed_at = models.DateTimeField(auto_now_add=True)
    note = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ("changed_at",)
        verbose_name_plural = "Order status histories"

    def __str__(self):
        return f"{self.order.order_number}: {self.status}"
