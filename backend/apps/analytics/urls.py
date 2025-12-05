from django.urls import path
from .views import DashboardStatsView, PatientRiskView, DemandForecastView, ChatbotView

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),

    path('risk/<uuid:patient_id>/', PatientRiskView.as_view(), name='patient-risk'),
    path('forecast/', DemandForecastView.as_view(), name='demand-forecast'),
    path('chat/', ChatbotView.as_view(), name='chatbot'),
]