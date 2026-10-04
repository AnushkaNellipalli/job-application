from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import override_settings
from rest_framework.test import APITestCase

User = get_user_model()

FAST_HASHER = ["django.contrib.auth.hashers.MD5PasswordHasher"]  # keeps tests quick
STRONG_PASSWORD = "Sup3r-Secret-Pass!"

REGISTER = "/api/auth/register/"
LOGIN = "/api/auth/login/"
REFRESH = "/api/auth/token/refresh/"
LOGOUT = "/api/auth/logout/"
ME = "/api/auth/me/"


def register_payload(**overrides):
    payload = {
        "fullName": "Jane Doe",
        "email": "jane@example.com",
        "password": STRONG_PASSWORD,
        "confirmPassword": STRONG_PASSWORD,
    }
    payload.update(overrides)
    return payload


@override_settings(PASSWORD_HASHERS=FAST_HASHER)
class RegisterTests(APITestCase):
    def setUp(self):
        cache.clear()  # reset throttle counters between tests

    def test_register_creates_user_and_returns_tokens(self):
        response = self.client.post(REGISTER, register_payload(), format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["user"]["email"], "jane@example.com")
        self.assertEqual(response.data["user"]["fullName"], "Jane Doe")
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertNotIn("password", response.data["user"])
        user = User.objects.get(email="jane@example.com")
        self.assertTrue(user.check_password(STRONG_PASSWORD))
        self.assertNotEqual(user.password, STRONG_PASSWORD)  # stored hashed

    def test_email_is_lowercased(self):
        self.client.post(REGISTER, register_payload(email="Jane@Example.COM"), format="json")
        self.assertTrue(User.objects.filter(email="jane@example.com").exists())

    def test_duplicate_email_rejected_case_insensitively(self):
        self.client.post(REGISTER, register_payload(), format="json")
        for email in ("jane@example.com", "JANE@example.com"):
            response = self.client.post(REGISTER, register_payload(email=email), format="json")
            self.assertEqual(response.status_code, 400)
            self.assertEqual(
                [str(m) for m in response.data["email"]],
                ["An account with this email already exists."],
            )

    def test_password_mismatch_rejected(self):
        response = self.client.post(REGISTER, register_payload(confirmPassword="different"), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("confirmPassword", response.data)

    def test_weak_password_rejected(self):
        response = self.client.post(
            REGISTER, register_payload(password="12345678", confirmPassword="12345678"), format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("password", response.data)

    def test_missing_fields_rejected(self):
        response = self.client.post(REGISTER, {"email": "a@b.com"}, format="json")
        self.assertEqual(response.status_code, 400)
        for field in ("fullName", "password", "confirmPassword"):
            self.assertIn(field, response.data)

    def test_stale_authorization_header_does_not_break_register(self):
        response = self.client.post(
            REGISTER, register_payload(), format="json", HTTP_AUTHORIZATION="Bearer not-a-real-token"
        )
        self.assertEqual(response.status_code, 201)


@override_settings(PASSWORD_HASHERS=FAST_HASHER)
class LoginTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            email="jane@example.com", password=STRONG_PASSWORD, full_name="Jane Doe"
        )

    def test_login_returns_tokens_and_user(self):
        response = self.client.post(LOGIN, {"email": "jane@example.com", "password": STRONG_PASSWORD}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["fullName"], "Jane Doe")

    def test_login_email_is_case_insensitive(self):
        response = self.client.post(LOGIN, {"email": "  JANE@Example.com ", "password": STRONG_PASSWORD}, format="json")
        self.assertEqual(response.status_code, 200)

    def test_wrong_password_is_401(self):
        response = self.client.post(LOGIN, {"email": "jane@example.com", "password": "nope"}, format="json")
        self.assertEqual(response.status_code, 401)

    def test_unknown_email_is_401(self):
        response = self.client.post(LOGIN, {"email": "ghost@example.com", "password": STRONG_PASSWORD}, format="json")
        self.assertEqual(response.status_code, 401)

    def test_inactive_user_cannot_login(self):
        self.user.is_active = False
        self.user.save()
        response = self.client.post(LOGIN, {"email": "jane@example.com", "password": STRONG_PASSWORD}, format="json")
        self.assertEqual(response.status_code, 401)

    def test_login_is_throttled(self):
        statuses = [
            self.client.post(LOGIN, {"email": "jane@example.com", "password": "bad"}, format="json").status_code
            for _ in range(21)
        ]
        self.assertEqual(statuses[-1], 429)


@override_settings(PASSWORD_HASHERS=FAST_HASHER)
class TokenFlowTests(APITestCase):
    def setUp(self):
        cache.clear()
        User.objects.create_user(email="jane@example.com", password=STRONG_PASSWORD, full_name="Jane Doe")
        login = self.client.post(LOGIN, {"email": "jane@example.com", "password": STRONG_PASSWORD}, format="json")
        self.access, self.refresh = login.data["access"], login.data["refresh"]

    def test_me_requires_authentication(self):
        self.assertEqual(self.client.get(ME).status_code, 401)

    def test_me_returns_current_user(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")
        response = self.client.get(ME)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["email"], "jane@example.com")

    def test_refresh_issues_new_access_and_rotates_refresh(self):
        response = self.client.post(REFRESH, {"refresh": self.refresh}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertNotEqual(response.data["refresh"], self.refresh)
        # the old refresh token was blacklisted by rotation
        self.assertEqual(self.client.post(REFRESH, {"refresh": self.refresh}, format="json").status_code, 401)

    def test_logout_revokes_refresh_token(self):
        self.assertEqual(self.client.post(LOGOUT, {"refresh": self.refresh}, format="json").status_code, 204)
        self.assertEqual(self.client.post(REFRESH, {"refresh": self.refresh}, format="json").status_code, 401)

    def test_logout_with_garbage_token_is_400(self):
        self.assertEqual(self.client.post(LOGOUT, {"refresh": "garbage"}, format="json").status_code, 400)

    def test_logout_requires_refresh_field(self):
        self.assertEqual(self.client.post(LOGOUT, {}, format="json").status_code, 400)
