from django.contrib import admin, messages

from .models import Order, OrderItem, OrderStatusHistory


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    fields = ("product_name", "variation_label", "unit_price", "quantity", "line_total")
    readonly_fields = fields

    def has_add_permission(self, request, obj=None):
        return False


class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    can_delete = False
    fields = ("status", "changed_at", "note")
    readonly_fields = fields

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("order_number", "customer_name", "phone_number", "status", "coupon", "total", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("order_number", "customer_name", "phone_number", "email")
    readonly_fields = (
        "order_number",
        "coupon",
        "subtotal",
        "discount_amount",
        "total",
        "status",
        "created_at",
        "updated_at",
    )
    inlines = [OrderItemInline, OrderStatusHistoryInline]
    actions = ["mark_processing", "mark_shipped", "mark_delivered", "mark_cancelled"]

    def has_add_permission(self, request):
        # Orders are only ever created through guest checkout.
        return False

    def _transition(self, request, queryset, new_status):
        updated = 0
        for order in queryset:
            try:
                order.set_status(new_status)
                updated += 1
            except ValueError as exc:
                self.message_user(request, f"{order.order_number}: {exc}", level=messages.ERROR)
        if updated:
            self.message_user(request, f"Updated {updated} order(s) to '{new_status}'.")

    @admin.action(description="Mark selected orders as Processing")
    def mark_processing(self, request, queryset):
        self._transition(request, queryset, Order.Status.PROCESSING)

    @admin.action(description="Mark selected orders as Shipped")
    def mark_shipped(self, request, queryset):
        self._transition(request, queryset, Order.Status.SHIPPED)

    @admin.action(description="Mark selected orders as Delivered")
    def mark_delivered(self, request, queryset):
        self._transition(request, queryset, Order.Status.DELIVERED)

    @admin.action(description="Mark selected orders as Cancelled")
    def mark_cancelled(self, request, queryset):
        self._transition(request, queryset, Order.Status.CANCELLED)
