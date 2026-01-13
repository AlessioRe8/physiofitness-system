import random
from apps.patients.models import Patient



class NoShowPredictor:
    def predict_risk(self, patient_id):
        """
        Calculates a risk score (0-100) based on patient history and demographics.
        """
        try:
            patient = Patient.objects.get(id=patient_id)

            risk_score = 15

            if patient.no_show_history > 0:
                risk_score += (patient.no_show_history * 15)

            if patient.distance_from_clinic > 20:
                risk_score += 15
            elif patient.distance_from_clinic > 10:
                risk_score += 5

            if 18 <= patient.age <= 25:
                risk_score += 10

            risk_score = min(risk_score, 98)

            return {
                "patient_id": patient_id,
                "risk_score": int(risk_score),
                "risk_label": "High" if risk_score > 50 else "Low"
            }

        except Patient.DoesNotExist:
            return {"error": "Patient not found", "risk_score": 0}


class DemandForecaster:
    def predict_next_week(self, therapist=None):
        """
        Returns predicted appointment counts for the next 7 days.
        """
        forecast = []
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

        base_demand = [12, 15, 14, 16, 18, 8, 2]

        for i, day in enumerate(days):
            variation = random.randint(-2, 3)
            count = max(0, base_demand[i] + variation)

            forecast.append({
                "weekday": day,
                "predicted_count": count
            })

        return forecast