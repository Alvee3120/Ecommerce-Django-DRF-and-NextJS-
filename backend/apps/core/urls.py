from django.urls import path

from .views import SiteSettingsView

urlpatterns = [
    path("site-settings/", SiteSettingsView.as_view(), name="site-settings"),
]
