from django.db.models import Q
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count

from apps.scheduling.models import Appointment


class NoShowPredictor:
    """
    A heuristic AI model that calculates the probability of a patient
    missing their next appointment based on historical data.
    """

    def predict_risk(self, patient_id):

        history = Appointment.objects.filter(
            patient_id=patient_id,
            status__in=['COMPLETED', 'NO_SHOW', 'CANCELLED']
        )

        total_count = history.count()

        if total_count == 0:
            return {
                "risk_score": 0,
                "label": "Low Risk",
                "reason": "New Patient (No history)"
            }

        no_shows = history.filter(status='NO_SHOW').count()
        cancellations = history.filter(status='CANCELLED').count()

        weighted_bad_events = no_shows + (cancellations * 0.5)

        probability = weighted_bad_events / total_count

        risk_score = min(int(probability * 100), 100)

        if risk_score > 50:
            label = "High Risk"
        elif risk_score > 20:
            label = "Medium Risk"
        else:
            label = "Low Risk"

        return {
            "risk_score": risk_score,
            "label": label,
            "reason": f"History: {no_shows} No-Shows, {cancellations} Cancellations out of {total_count} visits."
        }


class DemandForecaster:
    """
    Predicts future appointment demand based on historical data.
    """

    def predict_next_week(self, therapist=None):
        """
        Calculates forecast.
        If 'therapist' is provided, counts only THEIR appointments.
        If 'therapist' is None, counts ALL appointments (General).
        """
        today = timezone.now().date()
        predictions = []

        for i in range(7):
            target_date = today + timedelta(days=i)
            weekday_name = target_date.strftime("%A")

            history_counts = []
            for weeks_back in range(1, 5):
                past_date = target_date - timedelta(weeks=weeks_back)

                query_filters = {'start_time__date': past_date}

                if therapist:
                    query_filters['therapist'] = therapist

                count = Appointment.objects.filter(**query_filters).count()
                history_counts.append(count)

            avg_demand = sum(history_counts) / len(history_counts) if history_counts else 0

            predictions.append({
                "date": target_date,
                "weekday": weekday_name,
                "predicted_count": round(avg_demand, 1)
            })

        return predictions