from rest_framework import serializers

from .models import Popup


class PopupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Popup
        fields = ("id", "title", "image", "text", "button_text", "button_link", "delay_seconds")
