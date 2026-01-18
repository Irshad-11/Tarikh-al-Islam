# backend/api/filters.py
import django_filters
from .models import Event

class EventFilter(django_filters.FilterSet):
    year = django_filters.NumberFilter(field_name='start_year_ad')
    tag = django_filters.CharFilter(field_name='tags__tag__slug')
    search = django_filters.CharFilter(method='filter_search')  # Custom if needed

    class Meta:
        model = Event
        fields = ['start_year_ad', 'end_year_ad', 'location_name']

    def filter_search(self, queryset, name, value):
        return queryset.filter(title__icontains=value) | queryset.filter(description_md__icontains=value)