import string
import random
from django.db import models  # Ensure correct import
from django.utils import timezone

# Create your models here.
def generate_short_code(length=6):
    """Generates a random short code of specified length."""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

class URL(models.Model):
    original_url = models.URLField(unique=True)
    short_code = models.CharField(max_length=6, unique=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.short_code:
            self.short_code = generate_short_code()
            while URL.objects.filter(short_code=self.short_code).exists():
                self.short_code = generate_short_code()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.original_url} -> {self.short_code}"

class Click(models.Model):  # Corrected the typo here
    url = models.ForeignKey(URL, on_delete=models.CASCADE, related_name='clicks')
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Click on {self.url.short_code} at {self.timestamp}"