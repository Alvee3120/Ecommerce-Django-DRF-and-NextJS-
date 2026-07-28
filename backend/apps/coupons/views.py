from decimal import Decimal

from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Coupon
from .serializers import CouponValidateSerializer


class CouponValidateView(APIView):
    def post(self, request):
        serializer = CouponValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data["code"].upper().strip()
        subtotal = serializer.validated_data["subtotal"]

        coupon = Coupon.objects.filter(code=code).first()
        if coupon is None:
            return Response(
                {"valid": False, "discount_amount": "0.00", "message": "Invalid coupon code."}
            )

        is_valid, discount_amount, message = coupon.validate_for_amount(subtotal)
        return Response(
            {"valid": is_valid, "discount_amount": str(discount_amount), "message": message}
        )
