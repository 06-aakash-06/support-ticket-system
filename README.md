# Support Ticket System

Tech Intern Assessment Submission

---

## Overview

This project is a full-stack Support Ticket System built using:

- Backend: Django + Django REST Framework + PostgreSQL
- Frontend: React (Vite)
- LLM Integration: OpenAI API (configurable via environment variable)
- Infrastructure: Docker + Docker Compose

Users can:

- Submit support tickets
- Receive automatic LLM-based category and priority suggestions
- Browse, filter, and search tickets
- Update ticket status
- View aggregated ticket statistics in a dashboard

The entire application runs using:

    docker-compose up --build

---

## Architecture Overview

### Backend (Django)

- RESTful API using Django REST Framework
- PostgreSQL database
- Database-level aggregation for analytics
- Filtering and search via DjangoFilterBackend and SearchFilter
- Dedicated LLM classification endpoint

### Frontend (React)

- Component-based architecture
- Ticket submission form with live LLM suggestions
- Ticket list with:
  - Search
  - Filters (category, priority, status)
  - Status updates
  - Truncated descriptions with expand-on-click
- Analytics dashboard using Recharts

### Infrastructure

- Fully containerized using Docker
- PostgreSQL service
- Django backend service (runs migrations on startup)
- React frontend service
- Environment variable–based configuration

---

## Setup Instructions

### 1. Prerequisites

- Docker
- Docker Compose

No additional setup steps are required.

---

### 2. Environment Variables

Create a `.env` file in the project root:

    LLM_API_KEY=your_openai_api_key_here

The API key is injected into the backend container via `docker-compose.yml`.

The API key is not hardcoded in the repository.

---

### 3. Run the Application

    docker-compose up --build

Services:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- PostgreSQL: internal Docker network

The backend automatically runs database migrations on startup.

---

## API Endpoints

### Tickets

- POST   /api/tickets/             Create a new ticket
- GET    /api/tickets/             List tickets (supports filters and search)
- PATCH  /api/tickets/<id>/        Update ticket status/category/priority
- GET    /api/tickets/stats/       Aggregated analytics
- POST   /api/tickets/classify/    LLM-based suggestion

---

## Filtering and Search

Supported query parameters:

    ?category=
    ?priority=
    ?status=
    ?search=

Search applies to both title and description.

All filters can be combined.

---

## Stats Endpoint

Returns:

```json
{
  "total_tickets": 124,
  "open_tickets": 67,
  "avg_tickets_per_day": 8.3,
  "priority_breakdown": {
    "low": 30,
    "medium": 52,
    "high": 31,
    "critical": 11
  },
  "category_breakdown": {
    "billing": 28,
    "technical": 55,
    "account": 22,
    "general": 19
  }
}
```

All aggregation is performed using database-level ORM aggregation
(annotate, aggregate, Count, Avg).

No Python-level loops are used.

---

## LLM Integration

### Model Choice

OpenAI API was used for classification due to:

- Structured JSON response capability
- Reliable categorization performance
- Simple REST integration

### Prompt Design

The model is instructed to:

- Classify description into one of:
  - billing
  - technical
  - account
  - general
- Suggest priority:
  - low
  - medium
  - high
  - critical
- Return a strict JSON response

The prompt is included in the codebase for review.

### Error Handling

If:

- The LLM API fails
- The API key is missing
- The response is malformed

The system:

- Gracefully falls back
- Allows ticket submission without suggestions
- Logs the error
- Does not block the user

---

## Frontend Features

### Ticket Form

- Required title (max 200 characters)
- Required description
- Live LLM auto-suggestions
- Editable category and priority
- Loading indicator during classification
- Clears form on successful submission

### Ticket List

- Newest first ordering
- Truncated descriptions (3-line clamp)
- Expand-on-click full description
- Filter dropdowns
- Search bar
- Status update via dropdown

### Dashboard

- Total tickets
- Open tickets
- Average tickets per day
- Priority distribution (Pie chart)
- Category distribution (Bar chart)
- Manual refresh button

---

## Docker Services

- db        -> PostgreSQL
- backend   -> Django API (runs migrations on startup)
- frontend  -> React app

Service dependencies are configured correctly.

The application runs fully with:

    docker-compose up --build

No manual steps are required beyond providing an API key.

---

## Design Decisions

- Database-level aggregation ensures scalability.
- Expandable truncated descriptions improve UI clarity.
- LLM integration implemented as a separate endpoint for modularity.
- Environment-based configuration prevents credential leakage.
- Clear separation between backend API logic and frontend state management.

---

## Submission Contents

- Backend source code
- Frontend source code
- Dockerfiles
- docker-compose.yml
- README.md
- .git directory with commit history

---

## Final Notes

The application is fully functional when started with:

    docker-compose up --build

LLM features require a valid API key.
