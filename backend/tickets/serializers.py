from rest_framework import serializers
from .models import Ticket
from .services.llm_service import classify_ticket


class TicketSerializer(serializers.ModelSerializer):

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
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        """
        Automatically classify ticket using LLM
        if category or priority not provided.
        User can still override.
        """

        description = validated_data.get("description", "")

        # Call LLM
        try:
            result = classify_ticket(description)

            if not validated_data.get("category"):
                validated_data["category"] = result["category"]

            if not validated_data.get("priority"):
                validated_data["priority"] = result["priority"]

        except Exception:
            # graceful fallback (assignment requirement)
            validated_data.setdefault("category", "general")
            validated_data.setdefault("priority", "medium")

        return super().create(validated_data)
