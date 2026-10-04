from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import SimpleTestCase, override_settings
from django.utils import timezone
from rest_framework.test import APITestCase

from .models import Job
from .utils import time_ago

User = get_user_model()
FAST_HASHER = ["django.contrib.auth.hashers.MD5PasswordHasher"]


def make_job(**overrides):
    data = {
        "title": "Frontend Developer",
        "company": "Aurora Tech",
        "location": "Remote",
        "salary": "$90k - $110k",
        "employment_type": "Full-Time",
    }
    data.update(overrides)
    return Job.objects.create(**data)


class TimeAgoTests(SimpleTestCase):
    def test_labels(self):
        now = timezone.now()
        cases = {
            timedelta(seconds=10): "Just now",
            timedelta(minutes=1): "1 minute ago",
            timedelta(hours=5): "5 hours ago",
            timedelta(days=1): "1 day ago",
            timedelta(days=2): "2 days ago",
            timedelta(days=7): "1 week ago",
            timedelta(days=21): "3 weeks ago",
            timedelta(days=60): "2 months ago",
            timedelta(days=800): "2 years ago",
        }
        for delta, expected in cases.items():
            self.assertEqual(time_ago(now - delta, now=now), expected)


class JobReadTests(APITestCase):
    def setUp(self):
        self.full = make_job(
            title="Senior Frontend Engineer",
            company="Nebula Labs",
            company_logo="NL",
            location="Remote (Worldwide)",
            experience="5+ years",
            skills=["React", "JavaScript"],
            description="Build things.",
            responsibilities=["Ship features."],
            benefits=["Remote work."],
            posted_at=timezone.now() - timedelta(days=2),
        )
        self.summary = make_job(
            title="UI Engineer", company="Brightwave", employment_type="Hybrid",
            posted_at=timezone.now() - timedelta(days=5),
        )

    def test_list_is_public_paginated_and_newest_first(self):
        response = self.client.get("/api/jobs/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 2)
        self.assertEqual([j["title"] for j in response.data["results"]], ["Senior Frontend Engineer", "UI Engineer"])

    def test_list_item_shape_matches_frontend(self):
        item = self.client.get("/api/jobs/").data["results"][0]
        self.assertEqual(
            set(item),
            {"id", "title", "company", "companyLogo", "location", "salary",
             "employmentType", "type", "experience", "postedAt"},
        )
        self.assertEqual(item["companyLogo"], "NL")
        self.assertEqual(item["type"], item["employmentType"])
        self.assertEqual(item["postedAt"], "2 days ago")

    def test_missing_logo_falls_back_to_company_initials(self):
        items = {j["company"]: j for j in self.client.get("/api/jobs/").data["results"]}
        self.assertEqual(items["Brightwave"]["companyLogo"], "BR")

    def test_detail_has_full_fields(self):
        data = self.client.get(f"/api/jobs/{self.full.pk}/").data
        self.assertEqual(data["skills"], ["React", "JavaScript"])
        self.assertEqual(data["responsibilities"], ["Ship features."])
        self.assertEqual(data["benefits"], ["Remote work."])
        self.assertEqual(data["description"], "Build things.")
        self.assertEqual(data["employmentType"], "Full-Time")
        self.assertEqual(data["postedAt"], "2 days ago")

    def test_search_by_title_and_company(self):
        self.assertEqual(self.client.get("/api/jobs/?search=nebula").data["count"], 1)
        self.assertEqual(self.client.get("/api/jobs/?search=engineer").data["count"], 2)
        self.assertEqual(self.client.get("/api/jobs/?search=zzz").data["count"], 0)

    def test_filter_by_employment_type_and_location(self):
        self.assertEqual(self.client.get("/api/jobs/?employmentType=Hybrid").data["count"], 1)
        self.assertEqual(self.client.get("/api/jobs/?location=worldwide").data["count"], 1)

    def test_invalid_employment_type_filter_is_400(self):
        self.assertEqual(self.client.get("/api/jobs/?employmentType=Nonsense").status_code, 400)

    def test_page_size_param_is_honoured_and_capped(self):
        page = self.client.get("/api/jobs/?page_size=1").data
        self.assertEqual((page["count"], len(page["results"])), (2, 1))
        self.assertIsNotNone(page["next"])
        self.assertEqual(self.client.get("/api/jobs/?page=2&page_size=1").data["results"][0]["title"], "UI Engineer")
        self.assertEqual(self.client.get("/api/jobs/?page_size=9999").status_code, 200)

    def test_ordering(self):
        response = self.client.get("/api/jobs/?ordering=title")
        self.assertEqual(response.data["results"][0]["title"], "Senior Frontend Engineer")

    def test_inactive_jobs_hidden_from_public(self):
        self.summary.is_active = False
        self.summary.save()
        self.assertEqual(self.client.get("/api/jobs/").data["count"], 1)
        self.assertEqual(self.client.get(f"/api/jobs/{self.summary.pk}/").status_code, 404)

    def test_recent_respects_limit(self):
        data = self.client.get("/api/jobs/recent/?limit=1").data
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["title"], "Senior Frontend Engineer")

    def test_recent_ignores_bad_limit(self):
        self.assertEqual(self.client.get("/api/jobs/recent/?limit=abc").status_code, 200)

    def test_similar_excludes_self_and_ranks_by_relatedness(self):
        react = make_job(title="React Engineer", company="Pixel Forge", skills=["React"])
        make_job(title="Product Designer", company="Nimbus", employment_type="On-site")
        data = self.client.get(f"/api/jobs/{self.full.pk}/similar/").data
        ids = [j["id"] for j in data]
        self.assertNotIn(self.full.pk, ids)
        self.assertEqual(ids[0], react.pk)  # shares a skill AND the word "Engineer"
        self.assertEqual(len(data), 3)

    def test_similar_for_missing_job_is_404(self):
        self.assertEqual(self.client.get("/api/jobs/9999/similar/").status_code, 404)


@override_settings(PASSWORD_HASHERS=FAST_HASHER)
class JobWriteTests(APITestCase):
    payload = {
        "title": "Backend Engineer",
        "company": "Acme",
        "location": "Hyderabad",
        "employmentType": "Full-Time",
        "skills": ["Python", "Django"],
    }

    def setUp(self):
        self.user = User.objects.create_user(email="user@example.com", password="x", full_name="U")
        self.staff = User.objects.create_user(email="staff@example.com", password="x", full_name="S", is_staff=True)

    def test_anonymous_cannot_create(self):
        self.assertEqual(self.client.post("/api/jobs/", self.payload, format="json").status_code, 401)

    def test_regular_user_cannot_create(self):
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.post("/api/jobs/", self.payload, format="json").status_code, 403)

    def test_staff_can_create_update_delete(self):
        self.client.force_authenticate(self.staff)
        created = self.client.post("/api/jobs/", self.payload, format="json")
        self.assertEqual(created.status_code, 201)
        self.assertEqual(created.data["companyLogo"], "AC")
        pk = created.data["id"]

        patched = self.client.patch(f"/api/jobs/{pk}/", {"salary": "₹20L"}, format="json")
        self.assertEqual(patched.status_code, 200)
        self.assertEqual(Job.objects.get(pk=pk).salary, "₹20L")

        self.assertEqual(self.client.delete(f"/api/jobs/{pk}/").status_code, 204)

    def test_staff_can_see_closed_jobs(self):
        job = make_job(is_active=False)
        self.client.force_authenticate(self.staff)
        self.assertEqual(self.client.get(f"/api/jobs/{job.pk}/").status_code, 200)

    def test_validation_errors(self):
        self.client.force_authenticate(self.staff)
        bad_type = dict(self.payload, employmentType="Nonsense")
        self.assertEqual(self.client.post("/api/jobs/", bad_type, format="json").status_code, 400)
        bad_skills = dict(self.payload, skills="React")
        self.assertEqual(self.client.post("/api/jobs/", bad_skills, format="json").status_code, 400)
        self.assertEqual(self.client.post("/api/jobs/", {"title": "x"}, format="json").status_code, 400)
