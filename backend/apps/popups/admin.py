from django.contrib import admin

from .models import Popup


@admin.register(Popup)
class PopupAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "delay_seconds", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title",)
