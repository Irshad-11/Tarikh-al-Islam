# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, EventViewSet, PendingEventsView, ApproveEventView, RejectEventView,
    DeletionRequestsView, RequestDeletionView, ConfirmDeletionView, DenyDeletionView,
    ContributorListView, SuspendContributorView, ActivateContributorView,
    current_user,          # ← add this import
)
from django.contrib.auth.views import LoginView, LogoutView

router = DefaultRouter()
router.register(r'events', EventViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(template_name='login.html'), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    
    # ← Add this line
    path('auth/user/', current_user, name='current-user'),
    
    # Admin Moderation
    path('admin/events/pending/', PendingEventsView.as_view(), name='pending-events'),
    path('admin/events/<int:pk>/approve/', ApproveEventView.as_view(), name='approve-event'),
    path('admin/events/<int:pk>/reject/', RejectEventView.as_view(), name='reject-event'),
    path('admin/events/deletions/', DeletionRequestsView.as_view(), name='deletion-requests'),
    path('events/<int:pk>/request-deletion/', RequestDeletionView.as_view(), name='request-deletion'),
    path('admin/events/<int:pk>/delete/', ConfirmDeletionView.as_view(), name='confirm-deletion'),
    path('admin/events/<int:pk>/deny-deletion/', DenyDeletionView.as_view(), name='deny-deletion'),
    
    # Contributor Management
    path('admin/contributors/', ContributorListView.as_view(), name='contributors'),
    path('admin/contributors/<int:pk>/suspend/', SuspendContributorView.as_view(), name='suspend-contributor'),
    path('admin/contributors/<int:pk>/activate/', ActivateContributorView.as_view(), name='activate-contributor'),
]