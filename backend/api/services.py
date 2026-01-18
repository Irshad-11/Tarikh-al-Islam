from django.utils import timezone
from .models import Event, EventModerationLog


def log_action(event, user, action, note=""):
    EventModerationLog.objects.create(
        event=event,
        performed_by=user,
        action=action,
        note=note,
    )


def approve_event(event, admin):
    event.status = Event.Status.APPROVED
    event.approved_at = timezone.now()
    event.save()
    log_action(event, admin, "APPROVED")


def reject_event(event, admin, note=""):
    event.status = Event.Status.REJECTED
    event.save()
    log_action(event, admin, "REJECTED", note)


def request_deletion(event, contributor):
    event.status = Event.Status.DELETION_REQUESTED
    event.save()
    log_action(event, contributor, "DELETION_REQUESTED")


def confirm_deletion(event, admin):
    event.status = Event.Status.DELETED
    event.save()
    log_action(event, admin, "DELETED")
