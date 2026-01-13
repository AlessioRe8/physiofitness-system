from rest_framework import serializers
from .models import Invoice, InvoiceItem, Payment
from apps.patients.serializers import PatientSerializer


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'invoice', 'service', 'description', 'quantity', 'unit_price', 'total_price']
        read_only_fields = ['total_price']
        extra_kwargs = {
            'unit_price': {'required': False},
            'description': {'required': False},
        }


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'invoice', 'amount', 'payment_date', 'method', 'transaction_id', 'note', 'created_at']
        read_only_fields = ['created_at']


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)

    patient_detail = PatientSerializer(source='patient', read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id', 'patient', 'patient_detail', 'appointment',
            'status', 'issue_date', 'due_date',
            'total_amount', 'notes',
            'items', 'payments', 'created_at'
        ]
        read_only_fields = ['created_at', 'payments']

    def validate(self, data):
        if data.get('due_date') and data.get('issue_date'):
            if data['due_date'] < data['issue_date']:
                raise serializers.ValidationError("Due date cannot be before issue date.")
        return data