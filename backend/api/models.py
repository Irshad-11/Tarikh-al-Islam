# backend/api/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    ROLE_CHOICES = (
        ('contributor', 'Contributor'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='contributor')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    # Override to use email as unique identifier if needed, but keeping username for now
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

class Event(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('DELETION_REQUESTED', 'Deletion Requested'),
        ('DELETED', 'Deleted'),
    )
    title = models.CharField(max_length=255)
    summary = models.TextField(blank=True, null=True)  # For timeline previews
    description_md = models.TextField()  # Markdown description
    location_name = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    start_year_ad = models.IntegerField()
    end_year_ad = models.IntegerField(blank=True, null=True)
    start_year_hijri = models.IntegerField(blank=True, null=True)
    end_year_hijri = models.IntegerField(blank=True, null=True)
    importance_level = models.IntegerField(default=1)  # 1-5 scale
    visibility_rank = models.IntegerField(default=1)  # For ordering in timeline
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_events')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.title

class EventSource(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='sources')
    title = models.CharField(max_length=255)
    url = models.URLField()
    is_primary_source = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} for {self.event.title}"

class Tag(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class EventTag(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tags')
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('event', 'tag')

class EventImage(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField()
    caption = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.event.title}"

class EventModerationLog(models.Model):
    ACTION_CHOICES = (
        ('CREATED', 'Created'),
        ('UPDATED', 'Updated'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('DELETION_REQUESTED', 'Deletion Requested'),
        ('DELETED', 'Deleted'),
        ('DELETION_DENIED', 'Deletion Denied'),
    )
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='moderation_logs')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} on {self.event.title} by {self.performed_by}"