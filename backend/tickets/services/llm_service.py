import os
import json
import requests

OPENROUTER_API_KEY = os.getenv("OPENAI_API_KEY")


def classify_ticket(description: str) -> dict:

    prompt = f"""
    You are a senior AI support triage engineer responsible for correctly classifying SaaS support tickets.

    Your job is to assign EXACTLY ONE category and EXACTLY ONE priority.

    You MUST follow the decision logic strictly. Do NOT guess randomly. Do NOT default to "general" unless absolutely nothing else applies.

    ========================================
    STEP 1 — DETERMINE CATEGORY
    ========================================

    Choose ONE:

    billing
    technical
    account
    general

    DETAILED DEFINITIONS:

    billing
    ONLY use if related to money, payments, invoices, subscriptions, or charges.

    Examples:
    - charged twice
    - refund request
    - invoice incorrect
    - subscription cancelled unexpectedly
    - payment failed but money deducted


    technical
    Use if ANY software behavior is broken, incorrect, buggy, slow, glitchy, visually broken, or not working as expected.

    This includes:
    - UI bugs
    - broken buttons
    - layout issues
    - performance problems
    - slow loading
    - API errors
    - crashes
    - unexpected behavior
    - features not behaving correctly

    Examples:
    - button not aligned
    - dashboard loads slowly
    - dropdown doesn't open
    - error message appears
    - page freezes
    - feature doesn't work properly

    IMPORTANT:
    ALL bugs, glitches, UI issues, or incorrect behavior are ALWAYS technical.
    DO NOT classify bugs as general.


    account
    Use ONLY for single-user account access or identity problems.

    Examples:
    - cannot login
    - password reset not working
    - account locked
    - cannot access profile
    - permission denied


    general
    Use ONLY if it is:

    - feature request
    - suggestion
    - question
    - feedback
    - curiosity
    - informational inquiry

    Examples:
    - "can you add dark mode"
    - "how does billing work"
    - "I suggest adding export feature"

    NEVER classify bugs as general.


    ========================================
    STEP 2 — DETERMINE PRIORITY
    ========================================

    Choose ONE:

    critical
    high
    medium
    low


    critical
    System unusable, data loss, security breach, ALL users blocked.

    Examples:
    - system down
    - data deleted
    - cannot access platform at all


    high
    Major functionality broken, user cannot complete core workflow.

    Examples:
    - cannot submit forms
    - login completely broken
    - payment system failing


    medium
    Bug exists but workaround exists, or inconvenience present.

    Examples:
    - slow performance
    - occasional errors


    low
    Cosmetic issues, minor bugs, suggestions, or non-urgent issues.

    Examples:
    - alignment issues
    - UI spacing wrong
    - minor visual glitch
    - feature requests


    ========================================
    STEP 3 — STRICT DECISION RULES
    ========================================

    Follow this EXACT decision order:

    1. If money involved → billing
    2. Else if software behavior incorrect in ANY way → technical
    3. Else if login/account access problem → account
    4. Else → general


    ========================================
    STEP 4 — PRIORITY SIGNAL WORDS
    ========================================

    critical signals:
    "down", "data loss", "security", "everyone affected"

    high signals:
    "cannot", "unable", "broken", "not working"

    medium signals:
    "slow", "sometimes", "occasionally"

    low signals:
    "minor", "slightly", "alignment", "suggestion", "feature request"


    ========================================
    STEP 5 — OUTPUT FORMAT
    ========================================

    Return ONLY raw JSON.

    NO explanation.
    NO markdown.
    NO extra text.

    Example:

    {{"category": "technical", "priority": "low"}}


    ========================================
    STEP 6 — TICKET DESCRIPTION
    ========================================

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
