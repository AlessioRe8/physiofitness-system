from django.db import models

class InventoryItem(models.Model):
    name = models.CharField(max_length=100)
    quantity = models.IntegerField()
    reorder_threshold = models.IntegerField()
    unit = models.CharField(max_length=50)
    notes = models.TextField(blank=True)

    def __str__(self):
        return self.name
