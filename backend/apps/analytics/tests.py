from django.test import TestCase
from apps.patients.models import Patient
from apps.analytics.ai import NoShowPredictor
from datetime import date


class AIModelTests(TestCase):
    def setUp(self):
        self.patient = Patient.objects.create(
            first_name="Test",
            last_name="User",
            tax_id="TESTUSER123",
            date_of_birth=date(1995, 1, 1),
            distance_from_clinic=5.0,
            no_show_history=0
        )

    def test_risk_prediction_logic(self):
        predictor = NoShowPredictor()
        risk = predictor.predict_risk(self.patient.id)
        print(f"\n[AI TEST] Calculated Age: {self.patient.age}")
        self.assertIsNotNone(risk)

    def test_high_risk_flag(self):
        bad_patient = Patient.objects.create(
            first_name="Bad",
            last_name="Actor",
            tax_id="BADACTOR999",
            date_of_birth=date(1990, 5, 5),
            distance_from_clinic=50.0,
            no_show_history=5
        )

        predictor = NoShowPredictor()
        risk = predictor.predict_risk(bad_patient.id)
        self.assertGreater(risk['risk_score'], 50)