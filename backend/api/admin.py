from django.contrib import admin
from .models import User, Event, EventModerationLog


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "role", "is_active")
    list_filter = ("role", "is_active")


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "created_by", "created_at")
    list_filter = ("status",)
    search_fields = ("title",)


@admin.register(EventModerationLog)
class EventModerationLogAdmin(admin.ModelAdmin):
    list_display = ("event", "action", "performed_by", "created_at")
