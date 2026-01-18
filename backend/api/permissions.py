# backend/api/permissions.py
from rest_framework.permissions import BasePermission, IsAuthenticated

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsContributor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'contributor' and request.user.is_active

class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return obj.created_by == request.user and obj.status == 'PENDING'