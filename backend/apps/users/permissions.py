from rest_framework.permissions import BasePermission, SAFE_METHODS
#MAYBE MOVE THIS TO apps/core

class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "Staff"
        )

class IsPhysiotherapist(BasePermission):
    def has_permission(self, request, view):
        return request.user.staff_role == "Physiotherapist"

class IsStaffOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return (
            request.user.is_authenticated
            and request.user.role == "Staff"
        )
