from django.db import models, transaction


class Popup(models.Model):
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to="popups/", blank=True, null=True)
    text = models.TextField(blank=True)
    button_text = models.CharField(max_length=100, blank=True)
    button_link = models.URLField(blank=True)
    delay_seconds = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        """
        Only one popup may be active at a time. Enforced here (not in the
        admin/serializer) so it holds no matter who writes the model.
        """
        with transaction.atomic():
            if self.is_active:
                Popup.objects.filter(is_active=True).exclude(pk=self.pk).update(is_active=False)
            super().save(*args, **kwargs)
