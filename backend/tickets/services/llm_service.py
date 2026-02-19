import os
import json
import requests

OPENROUTER_API_KEY = os.getenv("OPENAI_API_KEY")


def classify_ticket(description: str) -> dict:

    prompt = f"""You are an expert support ticket triage system for a SaaS platform. Classify the ticket description below into exactly one category and one priority.

## CATEGORIES

- **billing** — payments, invoices, charges, refunds, subscriptions, pricing, failed transactions, upgrade/downgrade
- **technical** — bugs, errors, crashes, performance issues, API problems, broken features, system outages, SERVICE-WIDE login failures affecting multiple users
- **account** — login issues for a SINGLE user, password resets, permissions, profile settings, 2FA, SSO, account locked/suspended
- **general** — questions, feedback, onboarding, feature requests, anything that doesn't clearly fit above

## PRIORITIES

- **critical** — system completely down, data loss, security breach, ALL users blocked, revenue impacted RIGHT NOW, cannot wait
- **high** — major feature broken for multiple users, significant workflow blocked, time-sensitive, workaround does not exist
- **medium** — partial functionality affected, single user impacted, workaround exists, not immediately blocking
- **low** — questions, minor UI issues, feature requests, cosmetic bugs, general curiosity, non-urgent feedback

## TIEBREAKER RULES (read carefully)

1. **Login issues**: if it affects ONE user → `account`. If it affects MULTIPLE users or the whole system → `technical`
2. **Billing + Technical overlap** → always prefer `billing`
3. **Account + Technical overlap** → always prefer `technical` if service-wide, `account` if user-specific
4. **Priority when in doubt** → always pick the HIGHER priority, never lower
5. **Urgency signals** — words like "urgent", "ASAP", "all users", "everyone", "system down", "can't work", "data loss" → push toward `critical` or `high`
6. **Production outages** → ALWAYS `critical`, no exceptions, regardless of how calmly it's written
7. **Feature requests / "would be nice"** → ALWAYS `low`
8. **Vague or very short descriptions** → `general` + `low`

## OUTPUT

Return ONLY raw JSON. No markdown, no explanation, no extra text whatsoever.

{{"category": "<billing|technical|account|general>", "priority": "<low|medium|high|critical>"}}

## TICKET DESCRIPTION

{description}"""

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
