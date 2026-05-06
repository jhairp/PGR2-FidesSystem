from rest_framework.permissions import IsAuthenticated


class BautizoPermission(IsAuthenticated):
    pass