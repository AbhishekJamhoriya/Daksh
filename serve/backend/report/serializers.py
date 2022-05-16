from rest_framework import serializers
from report.models import Report
from report.models import Schedule

class EnergySerializer(serializers.ModelSerializer):
    class Meta:
        model=Report
        fields=('date_time', 'total_energy', 'device')

# class PostSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FormData
#         fields = ('start_date', 'end_date')

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields ="__all__"