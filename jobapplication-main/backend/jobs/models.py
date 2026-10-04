from django.db import models
from django.utils import timezone


class Job(models.Model):
    """
    One job posting. Field-for-field this mirrors the objects in src/data/jobs.js
    (job, similarJobs, recentJobs), with camelCase names converted to snake_case.
    """

    class EmploymentType(models.TextChoices):
        # Values are stored exactly as the frontend displays them.
        # NOTE: jobs.js mixes contract type (Full-Time) and workplace type
        # (Hybrid, On-site) in a single "type" field; we keep that for a 1:1 match.
        FULL_TIME = "Full-Time", "Full-Time"
        PART_TIME = "Part-Time", "Part-Time"
        CONTRACT = "Contract", "Contract"
        INTERNSHIP = "Internship", "Internship"
        HYBRID = "Hybrid", "Hybrid"
        ON_SITE = "On-site", "On-site"
        REMOTE = "Remote", "Remote"

    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    company_logo = models.CharField(
        max_length=4,
        blank=True,
        help_text='Short text shown in the logo tile, e.g. "NL". Defaults to the first 2 letters of the company.',
    )
    location = models.CharField(max_length=200)
    salary = models.CharField(max_length=100, blank=True, help_text='Display text, e.g. "$120k - $150k / year".')
    employment_type = models.CharField(
        max_length=20, choices=EmploymentType.choices, default=EmploymentType.FULL_TIME
    )
    experience = models.CharField(max_length=50, blank=True, help_text='e.g. "5+ years".')
    description = models.TextField(blank=True)
    skills = models.JSONField(default=list, blank=True)  # ["React", "JavaScript", ...]
    responsibilities = models.JSONField(default=list, blank=True)
    benefits = models.JSONField(default=list, blank=True)

    is_active = models.BooleanField(
        default=True, help_text="Untick to close the posting; it disappears from the public API."
    )
    # The frontend shows "2 days ago"; we store a real timestamp and derive that text.
    posted_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-posted_at", "-id"]

    def __str__(self):
        return f"{self.title} @ {self.company}"

    @property
    def logo_text(self):
        return (self.company_logo or self.company[:2]).upper()
