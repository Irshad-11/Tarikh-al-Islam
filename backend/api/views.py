from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer

class EventList(APIView):
    def get(self, request):
        events = Event.objects.all().order_by("year")
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)


@api_view(["GET"])
def health_check(request):
    return Response({
        "status": "ok",
        "message": "Backend is connected successfully"
    })