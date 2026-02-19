from rest_framework import generics, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Avg
from django.db.models.functions import TruncDate

from .models import Ticket
from .serializers import TicketSerializer
from .services.llm_service import classify_ticket


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

        open_tickets = Ticket.objects.filter(
            status="open"
        ).count()

        tickets_per_day = (
            Ticket.objects
            .annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(count=Count("id"))
        )

        avg_tickets_per_day = (
            tickets_per_day.aggregate(
                avg=Avg("count")
            )["avg"] or 0
        )

        priority_counts = (
            Ticket.objects
            .values("priority")
            .annotate(count=Count("id"))
        )

        priority_breakdown = {
            item["priority"]: item["count"]
            for item in priority_counts
        }

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


class TicketClassifyView(APIView):

    def post(self, request):

        description = request.data.get("description", "")

        if not description:
            return Response(
                {"error": "Description is required"},
                status=400
            )

        result = classify_ticket(description)

        return Response({
            "suggested_category": result["category"],
            "suggested_priority": result["priority"],
        })
