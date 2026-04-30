# apps/usuarios/permissions.py

from rest_framework.permissions import BasePermission


class EsAdministrador(BasePermission):

    def has_permission(self, request, view):

        return True