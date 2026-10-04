"""
Serializers turn Python objects into JSON (and validate JSON coming in).

Field names are camelCase (fullName, confirmPassword) because that is what your
React code already uses (see fullName in ApplyForm.jsx).
"""
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Safe, read-only view of a user. Never includes the password hash."""

    fullName = serializers.CharField(source="full_name", read_only=True)
    dateJoined = serializers.DateTimeField(source="date_joined", read_only=True)

    class Meta:
        model = User
        fields = ("id", "fullName", "email", "dateJoined")
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source="full_name", min_length=2, max_length=150)
    # Declared explicitly so DRF does not add its own case-sensitive "unique" check
    # (whose message is awkward); validate_email below does a case-insensitive one.
    email = serializers.EmailField(max_length=254)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    confirmPassword = serializers.CharField(write_only=True, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ("id", "fullName", "email", "password", "confirmPassword")
        read_only_fields = ("id",)

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirmPassword"]:
            raise serializers.ValidationError({"confirmPassword": "Passwords do not match."})

        # Run Django's password rules (length, too common, all numeric, similar to email/name).
        candidate = User(email=attrs["email"], full_name=attrs["full_name"])
        try:
            validate_password(attrs["password"], user=candidate)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"password": list(exc.messages)})
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirmPassword")
        return User.objects.create_user(**validated_data)


class LoginSerializer(TokenObtainPairSerializer):
    """
    SimpleJWT's login serializer, adjusted so that it:
      * treats the email case-insensitively,
      * embeds email + fullName inside the token,
      * returns the user's details alongside the tokens.

    Because User.USERNAME_FIELD is "email", the request body is {email, password}.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["fullName"] = user.full_name
        return token

    def validate(self, attrs):
        attrs["email"] = attrs["email"].strip().lower()
        data = super().validate(attrs)  # -> {"refresh": ..., "access": ...}; raises 401 if wrong
        data["user"] = UserSerializer(self.user).data
        return data


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
