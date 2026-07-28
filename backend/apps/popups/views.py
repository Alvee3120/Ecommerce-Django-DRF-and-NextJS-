from rest_framework import generics, status
from rest_framework.response import Response

from .models import Popup
from .serializers import PopupSerializer


class ActivePopupView(generics.GenericAPIView):
    serializer_class = PopupSerializer

    def get(self, request, *args, **kwargs):
        popup = Popup.objects.filter(is_active=True).first()
        if popup is None:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(self.get_serializer(popup).data)
