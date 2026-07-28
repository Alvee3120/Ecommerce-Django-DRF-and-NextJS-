from django.db import models

from apps.core.models import SEOModel, TimeStampedModel


class Category(SEOModel, TimeStampedModel):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="children",
    )
    image = models.ImageField(upload_to="categories/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ("sort_order", "name")
        unique_together = ("parent", "name")

    def __str__(self):
        return self.name
