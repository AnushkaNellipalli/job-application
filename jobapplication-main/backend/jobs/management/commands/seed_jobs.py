"""
Load the sample jobs from src/data/jobs.js into the database.

    python manage.py seed_jobs

Safe to run more than once: a job that already exists (same title + company) is left alone.
"""
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from jobs.models import Job

# Copied from src/data/jobs.js. `days_ago` replaces the hard-coded "2 days ago" text and
# is staggered so /api/jobs/ returns the same order Jobs.jsx used to render.
SEED_JOBS = [
    {
        "title": "Senior Frontend Engineer",
        "company": "Nebula Labs",
        "company_logo": "NL",
        "location": "Remote (Worldwide)",
        "salary": "$120k - $150k / year",
        "employment_type": "Full-Time",
        "experience": "5+ years",
        "days_ago": 2,
        "skills": ["React", "JavaScript", "HTML", "CSS", "TypeScript", "Tailwind CSS"],
        "description": (
            "We're looking for a passionate Senior Frontend Engineer to build delightful user "
            "experiences for our growing customer base. You'll work closely with product, design, "
            "and backend teams to ship high-impact features."
        ),
        "responsibilities": [
            "Build and maintain scalable, accessible React applications.",
            "Collaborate with designers to translate Figma mockups into pixel-perfect UI.",
            "Optimize components for maximum performance across devices.",
            "Mentor junior engineers and lead code reviews.",
            "Drive frontend architecture decisions and best practices.",
        ],
        "benefits": [
            "Fully remote work with flexible hours.",
            "Health, dental, and vision insurance.",
            "Annual learning and conference budget.",
            "Home office equipment stipend.",
            "Unlimited PTO with a 15-day minimum.",
        ],
    },
    # similarJobs
    {"title": "Frontend Developer", "company": "Aurora Tech", "location": "Remote",
     "salary": "$90k - $110k", "employment_type": "Full-Time", "days_ago": 3},
    {"title": "React Engineer", "company": "Pixel Forge", "location": "Berlin, Germany",
     "salary": "€70k - €90k", "employment_type": "Full-Time", "days_ago": 4},
    {"title": "UI Engineer", "company": "Brightwave", "location": "New York, USA",
     "salary": "$100k - $130k", "employment_type": "Hybrid", "days_ago": 5},
    # recentJobs
    {"title": "Full Stack Developer", "company": "Cloudpeak", "location": "Remote",
     "salary": "$110k - $140k", "employment_type": "Full-Time", "days_ago": 6},
    {"title": "Product Designer", "company": "Nimbus", "location": "London, UK",
     "salary": "£60k - £80k", "employment_type": "On-site", "days_ago": 7},
]


class Command(BaseCommand):
    help = "Load the sample jobs from the old frontend data file (jobs.js) into the database."

    def handle(self, *args, **options):
        created = 0
        for entry in SEED_JOBS:
            fields = dict(entry)
            days_ago = fields.pop("days_ago")
            title, company = fields.pop("title"), fields.pop("company")
            fields["posted_at"] = timezone.now() - timedelta(days=days_ago)
            _, was_created = Job.objects.get_or_create(title=title, company=company, defaults=fields)
            created += was_created
        self.stdout.write(self.style.SUCCESS(f"Seeded {created} new job(s); {len(SEED_JOBS) - created} already existed."))
