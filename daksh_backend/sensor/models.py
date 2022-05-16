from django.db import models
from django_jsonfield_backport.models import JSONField

# Define your models here.
class Sensor(models.Model):
    id = models.AutoField(primary_key=True)
    sensor_name = models.CharField(max_length=100, null=True)
    parent_id = models.IntegerField(default=-1)
    depth = models.IntegerField(default=0)
    content_url = models.CharField(max_length=400, null=True)
    enabled = models.BooleanField(default=False)

    def __str__(self):
        result = str(self.id)
        if self.sensor_name != None:
            result = self.sensor_name + '|' + result
        return result
