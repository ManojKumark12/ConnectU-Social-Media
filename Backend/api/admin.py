# api/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser,Post,Likes,Friends
  # adjust the import if needed

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    # Add your custom fields to the admin form
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('profile_photo', 'bio')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('profile_photo', 'bio')}),
    )
admin.site.register(Post)
admin.site.register(Likes)
admin.site.register(Friends)