import pytest


@pytest.mark.django_db
def test_register(client):
    res = client.post("/api/auth/register/", {
        "username": "u1",
        "password": "pass123"
    })
    assert res.status_code == 201


@pytest.mark.django_db
def test_login(client, contributor_user):
    res = client.post("/api/auth/login/", {
        "username": "contrib",
        "password": "test123"
    })
    assert res.status_code == 200
