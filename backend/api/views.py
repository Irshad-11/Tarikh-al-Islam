# backend/api/views.py
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import User, Event, EventModerationLog
from .serializers import UserSerializer, EventSerializer
from .permissions import IsAdmin, IsContributor, IsOwnerOrAdmin
from .filters import EventFilter

# Authentication Views (simple session-based for MVP)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(serializer.validated_data['password'])
        user.save()
        # After saving, we can add a moderation log if desired
        # EventModerationLog isn't relevant here, but you could log user creation if needed

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # Return the created user data (without password)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
# Event Views
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.filter(status='APPROVED')  # Default for public
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = EventFilter
    search_fields = ['title', 'description_md', 'summary']
    ordering_fields = ['start_year_ad', 'importance_level', 'visibility_rank']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        elif self.action in ['create']:
            return [IsContributor()]
        elif self.action in ['update', 'partial_update']:
            return [IsOwnerOrAdmin()]
        elif self.action in ['destroy']:
            return [IsAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.user.role == 'admin':
                return Event.objects.all()
            elif self.request.user.role == 'contributor':
                return Event.objects.filter(created_by=self.request.user)
        return Event.objects.filter(status='APPROVED')

    def perform_create(self, serializer):
        event = serializer.save(created_by=self.request.user, updated_by=self.request.user)
        EventModerationLog.objects.create(event=event, action='CREATED', performed_by=self.request.user)

    def perform_update(self, serializer):
        event = serializer.save(updated_by=self.request.user)
        EventModerationLog.objects.create(event=event, action='UPDATED', performed_by=self.request.user)

    def perform_destroy(self, instance):
        instance.status = 'DELETED'
        instance.save()
        EventModerationLog.objects.create(event=instance, action='DELETED', performed_by=self.request.user)

# Admin-specific views
class PendingEventsView(generics.ListAPIView):
    queryset = Event.objects.filter(status='PENDING')
    serializer_class = EventSerializer
    permission_classes = [IsAdmin]

class ApproveEventView(generics.UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAdmin]

    def perform_update(self, serializer):
        event = serializer.save(status='APPROVED', approved_at=timezone.now(), updated_by=self.request.user)
        EventModerationLog.objects.create(event=event, action='APPROVED', performed_by=self.request.user)

class RejectEventView(generics.UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAdmin]

    def perform_update(self, serializer):
        event = serializer.save(status='REJECTED', updated_by=self.request.user)
        EventModerationLog.objects.create(event=event, action='REJECTED', performed_by=self.request.user, note=self.request.data.get('note'))

class DeletionRequestsView(generics.ListAPIView):
    queryset = Event.objects.filter(status='DELETION_REQUESTED')
    serializer_class = EventSerializer
    permission_classes = [IsAdmin]

class RequestDeletionView(generics.UpdateAPIView):
    queryset = Event.objects.filter(status='APPROVED')
    serializer_class = EventSerializer
    permission_classes = [IsContributor]

    def perform_update(self, serializer):
        event = serializer.save(status='DELETION_REQUESTED', updated_by=self.request.user)
        EventModerationLog.objects.create(event=event, action='DELETION_REQUESTED', performed_by=self.request.user, note=self.request.data.get('note'))

class ConfirmDeletionView(generics.DestroyAPIView):
    queryset = Event.objects.filter(status='DELETION_REQUESTED')
    serializer_class = EventSerializer
    permission_classes = [IsAdmin]

    def perform_destroy(self, instance):
        instance.status = 'DELETED'
        instance.save()
        EventModerationLog.objects.create(event=instance, action='DELETED', performed_by=self.request.user)

class DenyDeletionView(generics.UpdateAPIView):
    queryset = Event.objects.filter(status='DELETION_REQUESTED')
    serializer_class = EventSerializer
    permission_classes = [IsAdmin]

    def perform_update(self, serializer):
        event = serializer.save(status='APPROVED', updated_by=self.request.user)
        EventModerationLog.objects.create(event=event, action='DELETION_DENIED', performed_by=self.request.user, note=self.request.data.get('note'))

# Contributor Management for Admin
class ContributorListView(generics.ListAPIView):
    queryset = User.objects.filter(role='contributor')
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

class SuspendContributorView(generics.UpdateAPIView):
    queryset = User.objects.filter(role='contributor')
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def perform_update(self, serializer):
        serializer.save(is_active=False)

class ActivateContributorView(generics.UpdateAPIView):
    queryset = User.objects.filter(role='contributor')
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def perform_update(self, serializer):
        serializer.save(is_active=True)
        


from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)