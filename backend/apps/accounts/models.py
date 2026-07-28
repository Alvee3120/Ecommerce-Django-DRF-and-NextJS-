from django.contrib.auth.models import AbstractUser

from django.db import models


class User(AbstractUser):
    """
    Custom user model, used today for Django admin/staff login.
    Kept separate from AbstractUser from day one so AUTH_USER_MODEL
    never needs to change later (swapping it after migrations exist
    is a painful migration) - this is what will back the future
    customer-account login/order-history feature.
    """

    email = models.EmailField(unique=True)
