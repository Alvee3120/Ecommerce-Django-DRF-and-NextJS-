from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import Order
from .serializers import CheckoutSerializer, OrderDetailSerializer


class CheckoutView(generics.CreateAPIView):
    serializer_class = CheckoutSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderDetailSerializer(order).data, status=201)


class OrderLookupView(generics.RetrieveAPIView):
    serializer_class = OrderDetailSerializer

    def get_object(self):
        order_number = self.request.query_params.get("order_number")
        phone = self.request.query_params.get("phone")
        if not order_number or not phone:
            raise ValidationError("order_number and phone query params are both required.")
        return get_object_or_404(Order, order_number__iexact=order_number, phone_number=phone)
