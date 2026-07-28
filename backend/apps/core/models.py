from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SEOModel(models.Model):
    slug = models.SlugField(unique=True, max_length=255)
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    class Meta:
        abstract = True


class SiteSettings(models.Model):
    """
    Singleton: exactly one row (pk=1) holds the admin-controlled site
    branding/theme, exposed read-only via the API for the frontend to
    apply as CSS variables etc.
    """

    site_name = models.CharField(max_length=255, default="My Store")
    favicon = models.ImageField(upload_to="site/", blank=True, null=True)
    logo = models.ImageField(upload_to="site/", blank=True, null=True)
    primary_color = models.CharField(max_length=7, default="#000000", help_text="Hex color, e.g. #1a1a1a")
    secondary_color = models.CharField(max_length=7, default="#ffffff", help_text="Hex color, e.g. #ffffff")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return self.site_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass  # singleton: never actually delete the row

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
