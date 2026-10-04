from django.contrib import admin

from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "location", "employment_type", "is_active", "posted_at")
    list_filter = ("employment_type", "is_active")
    search_fields = ("title", "company", "location")
    date_hierarchy = "posted_at"
