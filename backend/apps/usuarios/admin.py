# apps/usuarios/admin.py

from django.contrib import admin
from .models import Personas, Usuarios, Rols, PerRols

admin.site.register(Personas)
admin.site.register(Usuarios)
admin.site.register(Rols)
admin.site.register(PerRols)
