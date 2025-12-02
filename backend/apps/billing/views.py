from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum
from .models import Invoice, InvoiceItem, Payment
from .serializers import InvoiceSerializer, InvoiceItemSerializer, PaymentSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'patient', 'issue_date']
    ordering_fields = ['issue_date', 'total_amount']
    ordering = ['-issue_date']


class InvoiceItemViewSet(viewsets.ModelViewSet):
    queryset = InvoiceItem.objects.all()
    serializer_class = InvoiceItemSerializer
    permission_classes = [permissions.IsAuthenticated]


class PaymentViewSet(viewsets.ModelViewSet):

    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        payment = serializer.save()
        invoice = payment.invoice
        total_paid = invoice.payments.aggregate(Sum('amount'))['amount__sum'] or 0

        if total_paid >= invoice.total_amount:
            invoice.status = Invoice.Status.PAID
        elif total_paid > 0:
            invoice.status = Invoice.Status.PARTIAL

        invoice.save()