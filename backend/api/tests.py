# backend/api/tests.py
import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from .models import User, Event, EventModerationLog
from factory.django import DjangoModelFactory
import factory

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f'user{n}')
    email = factory.Sequence(lambda n: f'user{n}@example.com')
    password = 'password'
    role = 'contributor'
    is_active = True

class EventFactory(DjangoModelFactory):
    class Meta:
        model = Event

    title = 'Test Event'
    description_md = 'Description'
    start_year_ad = 624
    status = 'PENDING'
    created_by = factory.SubFactory(UserFactory)

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def contributor(client):
    user = UserFactory(role='contributor')
    client.force_authenticate(user=user)
    return user, client

@pytest.fixture
def admin(client):
    user = UserFactory(role='admin')
    client.force_authenticate(user=user)
    return user, client

@pytest.mark.django_db
def test_create_event_as_contributor(contributor):
    user, client = contributor
    url = reverse('event-list')
    data = {
        'title': 'New Event',
        'description_md': 'Desc',
        'start_year_ad': 624
    }
    response = client.post(url, data)
    assert response.status_code == 201
    event = Event.objects.first()
    assert event.status == 'PENDING'
    assert EventModerationLog.objects.filter(action='CREATED').exists()

@pytest.mark.django_db
def test_approve_event_as_admin(admin):
    _, client = admin
    event = EventFactory(status='PENDING')
    url = reverse('approve-event', kwargs={'pk': event.pk})
    response = client.post(url)
    event.refresh_from_db()
    assert response.status_code == 200
    assert event.status == 'APPROVED'
    assert EventModerationLog.objects.filter(action='APPROVED').exists()

# Add more tests based on Test Plan: AUTH-01, EVT-01, ADM-01, DEL-01, PUB-01, SEC-01, etc.
# For brevity, not all implemented here; expand as needed.