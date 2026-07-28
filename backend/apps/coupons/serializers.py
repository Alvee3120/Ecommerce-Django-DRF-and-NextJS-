from decimal import Decimal

from rest_framework import serializers


class CouponValidateSerializer(serializers.Serializer):
    code = serializers.CharField()
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal("0"))
