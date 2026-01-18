import pytest
from django.contrib.auth import get_user_model

@pytest.fixture
def User():
    return get_user_model()


@pytest.fixture
def admin_user(db, User):
    return User.objects.create_user(
        username="admin",
        password="admin123",
        role=User.Role.ADMIN,
    )


@pytest.fixture
def contributor_user(db, User):
    return User.objects.create_user(
        username="contrib",
        password="test123",
        role=User.Role.CONTRIBUTOR,
    )
