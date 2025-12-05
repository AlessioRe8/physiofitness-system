from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta

from .ai import NoShowPredictor, DemandForecaster

from apps.scheduling.models import Appointment
from apps.billing.models import Invoice, Payment
from apps.patients.models import Patient


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        today = timezone.now().date()
        start_of_month = today.replace(day=1)

        total_patients = Patient.objects.filter(is_active=True).count()

        today_appointments = Appointment.objects.filter(
            start_time__date=today
        ).count()

        monthly_revenue = Payment.objects.filter(
            payment_date__gte=start_of_month
        ).aggregate(Sum('amount'))['amount__sum'] or 0.00

        pending_invoices = Invoice.objects.filter(
            status__in=['DRAFT', 'ISSUED']
        ).count()

        return Response({
            "total_patients": total_patients,
            "today_appointments": today_appointments,
            "monthly_revenue": monthly_revenue,
            "pending_invoices": pending_invoices,
            "generated_at": timezone.now()
        })


class PatientRiskView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, patient_id):
        predictor = NoShowPredictor()
        result = predictor.predict_risk(patient_id)
        return Response(result)

class DemandForecastView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        forecaster = DemandForecaster()

        general_data = forecaster.predict_next_week(therapist=None)

        response_data = {
            "clinic_forecast": general_data,
            "my_forecast": None  # Default to null
        }

        if request.user.role == 'PHYSIO':
            personal_data = forecaster.predict_next_week(therapist=request.user)
            response_data["my_forecast"] = personal_data

        return Response(response_data)



class ChatbotView(APIView):
    """
    A simple rule-based chatbot backend.
    React sends a message, it returns a response.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_message = request.data.get('message', '').lower()

        if 'hello' in user_message or 'hi' in user_message:
            response = "Hello! I am the PhysioFitness Assistant. How can I help you today?"

        elif 'open' in user_message or 'hour' in user_message:
            response = "We are open Monday to Friday, 08:00 to 20:00."

        elif 'book' in user_message or 'appointment' in user_message:
            response = "You can book an appointment by logging in and visiting the Scheduling page."

        elif 'price' in user_message or 'cost' in user_message:
            response = "Our initial consultation is €40. Massages start at €30."

        else:
            response = "I'm sorry, I didn't understand that. Please call our reception at 0123-4567890."

        return Response({"response": response})