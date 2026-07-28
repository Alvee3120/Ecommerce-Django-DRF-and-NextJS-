from django.urls import path

from .views import ActivePopupView

urlpatterns = [
    path("popups/active/", ActivePopupView.as_view(), name="popup-active"),
]
