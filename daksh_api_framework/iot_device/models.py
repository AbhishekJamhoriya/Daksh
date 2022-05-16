from django.db import models
from django.utils import timezone


class Device(models.Model):
    device_id = models.CharField(unique=True, max_length=50)
    name = models.CharField(max_length=255)
    enabled = models.BooleanField(default=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.device_id


class DeviceReading(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    time = models.DateTimeField(default=timezone.now)
    data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('device', 'time')

    def __str__(self):
        return "{} @{}".format(self.device.device_id, self.time)
