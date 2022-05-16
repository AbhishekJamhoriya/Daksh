from rest_framework import serializers
from devices.models import Equipment, MeasurementDevice


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        exclude = ('id', 'created_at', 'modified_at')


class MeasurementDeviceSerializer(serializers.ModelSerializer):
    # equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    equipment = EquipmentSerializer(read_only=True)

    class Meta:
        model = MeasurementDevice
        exclude = ('id', 'created_at', 'modified_at')

