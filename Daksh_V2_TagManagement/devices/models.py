from django.db import models


class Equipment(models.Model):
    name = models.CharField(unique=True, max_length=100)
    description = models.CharField(max_length=255, blank=True, default="")
    capacity = models.PositiveIntegerField(default=0)
    underload_limit = models.PositiveIntegerField(default=0)
    overload_limit = models.PositiveIntegerField(default=0)
    total_life_hrs = models.PositiveIntegerField(default=0)
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class MeasurementDevice(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    sld_id = models.CharField(max_length=100)
    device_id = models.CharField(unique=True, max_length=100)
    name = models.CharField(unique=True, max_length=100)
    description = models.CharField(max_length=255, blank=True, default="")
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
