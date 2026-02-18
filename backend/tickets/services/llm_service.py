import os
import json
import requests

OPENROUTER_API_KEY = os.getenv("OPENAI_API_KEY")


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

Return ONLY a valid JSON object. No explanation, no markdown, no extra text.

{{
  "category": "<billing|technical|account|general>",
  "priority": "<low|medium|high|critical>"
}}

## TICKET DESCRIPTION TO CLASSIFY

{description}
"""

    try:

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                # reliable free model
                "model": "mistralai/mistral-7b-instruct",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],

                # makes output deterministic and consistent
                "temperature": 0
            },
        )

        result = response.json()

        # handle OpenRouter errors gracefully
        if "choices" not in result:
            print("OpenRouter error:", result)
            return {
                "category": "general",
                "priority": "medium"
            }

        content = result["choices"][0]["message"]["content"].strip()

        # sometimes models wrap JSON in ```json blocks
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()

        parsed = json.loads(content)

        valid_categories = {"billing", "technical", "account", "general"}
        valid_priorities = {"low", "medium", "high", "critical"}

        category = parsed.get("category", "general")
        priority = parsed.get("priority", "medium")

        if category not in valid_categories:
            category = "general"

        if priority not in valid_priorities:
            priority = "medium"

        return {
            "category": category,
            "priority": priority,
        }

    except Exception as e:

        print("OpenRouter exception:", e)

        return {
            "category": "general",
            "priority": "medium",
        }
