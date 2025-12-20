from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum
from django.utils import timezone

from apps.scheduling.models import Appointment
from apps.billing.models import Invoice, Payment
from apps.patients.models import Patient

from .ai import NoShowPredictor, DemandForecaster


class DashboardStatsView(APIView):
    """
    Returns statistics based on the User's Role.
    - Admin: Sees Revenue, All Patients, All Appointments.
    - Physio: Sees My Appointments, My Patients, No Revenue.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()
        start_of_month = today.replace(day=1)

        data = {
            "total_patients": 0,
            "today_appointments": 0,
            "monthly_revenue": 0,
            "pending_invoices": 0,
            "role": user.role
        }

        if user.role == 'ADMIN' or user.is_superuser:
            data["total_patients"] = Patient.objects.filter(is_active=True).count()
            data["today_appointments"] = Appointment.objects.filter(start_time__date=today).count()

            revenue = Payment.objects.filter(payment_date__gte=start_of_month).aggregate(Sum('amount'))['amount__sum']
            data["monthly_revenue"] = revenue if revenue else 0.00

            data["pending_invoices"] = Invoice.objects.filter(status__in=['DRAFT', 'ISSUED']).count()

        elif user.role == 'PHYSIO':
            data["total_patients"] = Patient.objects.filter(is_active=True).count()
            data["today_appointments"] = Appointment.objects.filter(
                start_time__date=today,
                therapist=user
            ).count()
            data["monthly_revenue"] = 0
            data["pending_invoices"] = 0

        return Response(data)


class PatientRiskView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, patient_id):
        predictor = NoShowPredictor()
        result = predictor.predict_risk(patient_id)
        return Response(result)


class DemandForecastView(APIView):
    """
    Returns predicted appointment counts for the next 7 days.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        forecaster = DemandForecaster()

        general_data = forecaster.predict_next_week(therapist=None)

        response_data = {
            "clinic_forecast": general_data,
            "my_forecast": None
        }

        if request.user.role == 'PHYSIO':
            personal_data = forecaster.predict_next_week(therapist=request.user)
            response_data["my_forecast"] = personal_data

        return Response(response_data)


class ChatbotView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_message = request.data.get('message', '').lower()

        if 'hello' in user_message or 'hi' in user_message:
            response = "Hello! I am the PhysioFitness Assistant. How can I help you today?"
        elif 'open' in user_message or 'hour' in user_message:
            response = "We are open Monday to Friday, 09:00 to 18:00."
        elif 'book' in user_message or 'appointment' in user_message:
            response = "You can book an appointment by logging in and visiting the Scheduling page."
        elif 'price' in user_message or 'cost' in user_message:
            response = "Our initial consultation is €50. Massages start at €30."
        else:
            response = "I'm sorry, I didn't understand that. Please call our reception at 555-0123."

        return Response({"response": response})