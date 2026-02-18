from django.urls import path
from .views import TicketListCreateView, TicketUpdateView


urlpatterns = [
    path("tickets/", TicketListCreateView.as_view()),
    path("tickets/<int:pk>/", TicketUpdateView.as_view()),
]
