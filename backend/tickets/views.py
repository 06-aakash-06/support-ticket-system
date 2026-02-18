from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Ticket
from .serializers import TicketSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Avg
from django.db.models.functions import TruncDate


class TicketListCreateView(generics.ListCreateAPIView):
    queryset = Ticket.objects.all().order_by("-created_at")
    serializer_class = TicketSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]
    filterset_fields = [
        "category",
        "priority",
        "status",
    ]
    search_fields = [
        "title",
        "description",
    ]

class TicketUpdateView(generics.UpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    
class TicketStatsView(APIView):
    def get(self, request):
        total_tickets = Ticket.objects.count()
        open_tickets = Ticket.objects.filter(status="open").count()
        # avg tickets
        tickets_per_day = (
            Ticket.objects
            .annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(count=Count("id"))
        )

        avg_tickets_per_day = (
            tickets_per_day.aggregate(avg=Avg("count"))["avg"] or 0
        )

        #priorities
        priority_counts = (
            Ticket.objects
            .values("priority")
            .annotate(count=Count("id"))
        )

        priority_breakdown = {
            item["priority"]: item["count"]
            for item in priority_counts
        }

        #categories
        category_counts = (
            Ticket.objects
            .values("category")
            .annotate(count=Count("id"))
        )

        category_breakdown = {
            item["category"]: item["count"]
            for item in category_counts
        }

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": avg_tickets_per_day,
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown,
        })
