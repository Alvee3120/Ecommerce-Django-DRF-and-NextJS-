from django.urls import path

from .views import CheckoutView, OrderLookupView

urlpatterns = [
    path("orders/lookup/", OrderLookupView.as_view(), name="order-lookup"),
    path("orders/", CheckoutView.as_view(), name="order-create"),
]
