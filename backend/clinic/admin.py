from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Doctor, Appointment, Availability


# Custom User Admin
class CustomUserAdmin(UserAdmin):

    model = User

    fieldsets = UserAdmin.fieldsets + (
        ("Role Information", {"fields": ("role",)}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Role Information", {"fields": ("role",)}),
    )


# Register models
admin.site.register(User, CustomUserAdmin)
admin.site.register(Doctor)
admin.site.register(Appointment)
admin.site.register(Availability)