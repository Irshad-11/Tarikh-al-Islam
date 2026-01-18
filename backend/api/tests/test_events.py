import pytest
from api.models import Event


@pytest.mark.django_db
def test_contributor_can_create_event(client, contributor_user):
    client.login(username="contrib", password="test123")

    res = client.post("/api/events/", {
        "title": "Test Event",
        "summary": "Summary",
        "description_md": "Desc",
        "location_name": "Makkah",
        "start_year_ad": 600,
        "end_year_ad": 630,
    })

    assert res.status_code == 201
    assert Event.objects.count() == 1


@pytest.mark.django_db
def test_admin_sees_pending_events(client, admin_user):
    client.login(username="admin", password="admin123")
    res = client.get("/api/admin/events/pending/")
    assert res.status_code == 200


@pytest.mark.django_db
def test_event_filter_by_year(api_client, contributor_user):
    api_client.force_authenticate(contributor_user)

    Event.objects.create(
        title="Battle of Something",
        year_ad=700,
        created_by=contributor_user,
    )

    Event.objects.create(
        title="Later Event",
        year_ad=1200,
        created_by=contributor_user,
    )

    response = api_client.get("/api/events/?year_to=800")

    assert response.status_code == 200
    assert response.data["count"] == 1