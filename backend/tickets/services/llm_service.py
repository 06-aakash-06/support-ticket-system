import os
import json
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def classify_ticket(description: str) -> dict:

    prompt = f"""You are an expert support ticket triage system for a SaaS platform. Your job is to analyze support ticket descriptions and classify them accurately so customers get routed to the right team with the right urgency.

## CATEGORIES (choose exactly one)

- billing — payments, invoices, charges, refunds, subscriptions, pricing, failed transactions
- technical — bugs, errors, crashes, performance issues, integrations, API problems, features not working
- account — login issues, password resets, permissions, profile settings, account access, 2FA
- general — questions, feedback, onboarding, feature requests, anything that doesn't fit above

## PRIORITIES (choose exactly one)

- critical — system is completely down, data loss occurring, security breach, blocking ALL work, revenue directly impacted RIGHT NOW
- high — major feature broken, significant workflow blocked, affects multiple users, time-sensitive but not total outage
- medium — partial functionality affected, workaround exists, single user impacted, moderate inconvenience
- low — general questions, minor UI issues, feature requests, non-urgent feedback, curiosity

## CLASSIFICATION RULES

1. When in doubt between two priorities, pick the HIGHER one
2. Keywords like "urgent", "ASAP", "down", "can't work", "lost data" strongly suggest high or critical
3. If billing AND technical both apply, prefer billing
4. Vague or very short descriptions default to general + low
5. Production outages are ALWAYS critical regardless of tone

## OUTPUT FORMAT

Return ONLY valid JSON:

{{
  "category": "<billing|technical|account|general>",
  "priority": "<low|medium|high|critical>"
}}

## TICKET DESCRIPTION

{description}
"""

    try:

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0
        )

        content = response.choices[0].message.content.strip()

        result = json.loads(content)

        # safety validation
        valid_categories = {"billing", "technical", "account", "general"}
        valid_priorities = {"low", "medium", "high", "critical"}

        category = result.get("category", "general")
        priority = result.get("priority", "medium")

        if category not in valid_categories:
            category = "general"

        if priority not in valid_priorities:
            priority = "medium"

        return {
            "category": category,
            "priority": priority
        }

    except Exception:

        # graceful fallback (assignment requirement)
        return {
            "category": "general",
            "priority": "medium"
        }
