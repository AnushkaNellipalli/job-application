"""
Two serializers for the same model:

* JobListSerializer  - the small card shape used by Jobs.jsx and the Sidebar.
* JobSerializer      - the full shape used by JobDetailsCard.jsx (also used for
                       admin create/update).

Field names deliberately match src/data/jobs.js (companyLogo, employmentType,
postedAt, ...), so the React components can use the API response unchanged.
"""
from rest_framework import serializers

from .models import Job
from .utils import time_ago


class JobListSerializer(serializers.ModelSerializer):
    companyLogo = serializers.CharField(source="logo_text", read_only=True)
    employmentType = serializers.CharField(source="employment_type", read_only=True)
    # Sidebar.jsx and Jobs.jsx read `type` for the similar/recent jobs, so expose the same value under both names.
    type = serializers.CharField(source="employment_type", read_only=True)
    postedAt = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "company",
            "companyLogo",
            "location",
            "salary",
            "employmentType",
            "type",
            "experience",
            "postedAt",
        ]
        read_only_fields = fields

    def get_postedAt(self, obj):
        return time_ago(obj.posted_at)


class JobSerializer(serializers.ModelSerializer):
    # Readable AND writable; `source` maps the camelCase API name to the model field.
    companyLogo = serializers.CharField(
        source="company_logo", required=False, allow_blank=True, max_length=4
    )
    employmentType = serializers.ChoiceField(
        source="employment_type",
        choices=Job.EmploymentType.choices,
        default=Job.EmploymentType.FULL_TIME,
    )
    postedAt = serializers.SerializerMethodField()
    skills = serializers.ListField(child=serializers.CharField(max_length=100), required=False)
    responsibilities = serializers.ListField(
        child=serializers.CharField(max_length=500), required=False
    )
    benefits = serializers.ListField(child=serializers.CharField(max_length=500), required=False)

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "company",
            "companyLogo",
            "location",
            "salary",
            "employmentType",
            "experience",
            "postedAt",
            "skills",
            "description",
            "responsibilities",
            "benefits",
        ]
        read_only_fields = ["id", "postedAt"]

    def get_postedAt(self, obj):
        return time_ago(obj.posted_at)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Never send an empty logo: fall back to the company's initials (same rule Jobs.jsx used).
        data["companyLogo"] = instance.logo_text
        return data
