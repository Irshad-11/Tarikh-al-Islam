from django.urls import path
from .views import EventList , health_check

urlpatterns = [
    path("events/", EventList.as_view()),
    path("health/", health_check),
]
