from rest_framework import serializers

from .models import SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = (
            "site_name",
            "favicon",
            "logo",
            "primary_color",
            "secondary_color",
            "updated_at",
        )
