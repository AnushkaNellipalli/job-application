import django_filters

from .models import Job


class JobFilter(django_filters.FilterSet):
    """
    Query-string filters for GET /api/jobs/, e.g.
        /api/jobs/?employmentType=Hybrid&location=remote&company=nebula
    (Free-text search is separate: ?search=react)
    """

    employmentType = django_filters.ChoiceFilter(
        field_name="employment_type", choices=Job.EmploymentType.choices
    )
    location = django_filters.CharFilter(field_name="location", lookup_expr="icontains")
    company = django_filters.CharFilter(field_name="company", lookup_expr="icontains")

    class Meta:
        model = Job
        fields = []  # only the filters declared above
