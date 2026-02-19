from rest_framework import serializers
from .models import Ticket
from .services.llm_service import classify_ticket


class TicketSerializer(serializers.ModelSerializer):

    # make optional so frontend doesn't need to send them
    category = serializers.CharField(required=False)
    priority = serializers.CharField(required=False)
    status = serializers.CharField(required=False)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "title",
            "description",
            "category",
            "priority",
            "status",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
        ]


    def create(self, validated_data):

        description = validated_data.get("description", "")

        try:

            result = classify_ticket(description)

            validated_data.setdefault(
                "category",
                result["category"]
            )

            validated_data.setdefault(
                "priority",
                result["priority"]
            )

        except Exception:

            # graceful fallback (REQUIRED by assignment)
            validated_data.setdefault("category", "general")
            validated_data.setdefault("priority", "medium")

        validated_data.setdefault("status", "open")

        return super().create(validated_data)
