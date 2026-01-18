# backend/api/serializers.py
from rest_framework import serializers
from .models import User, Event, EventSource, Tag, EventTag, EventImage, EventModerationLog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_active', 'created_at', 'last_login']
        read_only_fields = ['id', 'created_at', 'last_login']

class EventSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventSource
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class EventTagSerializer(serializers.ModelSerializer):
    tag = TagSerializer(read_only=True)

    class Meta:
        model = EventTag
        fields = ['tag']

class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = '__all__'

class EventModerationLogSerializer(serializers.ModelSerializer):
    performed_by = UserSerializer(read_only=True)

    class Meta:
        model = EventModerationLog
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    sources = EventSourceSerializer(many=True, read_only=True)
    tags = EventTagSerializer(many=True, read_only=True)
    images = EventImageSerializer(many=True, read_only=True)
    moderation_logs = EventModerationLogSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)

    class Meta:
        model = Event
        fields = '__all__'

    def create(self, validated_data):
        # Custom create logic if needed
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Custom update logic
        return super().update(instance, validated_data)