import logging

from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from devices.models import Equipment, MeasurementDevice
from devices.serializers import EquipmentSerializer, MeasurementDeviceSerializer
from devices.utils import formatted_now_time

logger = logging.getLogger('django')


class CustomAPIException(ValidationError):
    """
    raises API exceptions with custom messages and custom status codes
    """
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'error'

    def __init__(self, detail, status_code=None):
        self.detail = detail
        if status_code is not None:
            self.status_code = status_code


class Equipments(APIView):
    """
        List, create, update and delete equipments
    """
    # Get all equipments
    def get(self, request):
        logger.info("{} | Get Equipments Request".format(formatted_now_time()))
        equipments = Equipment.objects.all()
        serializer = EquipmentSerializer(equipments, many=True)
        response = serializer.data
        logger.info("{} | Get Equipments Response - {}".format(formatted_now_time(), response))
        return Response(response)


class MeasurementDevices(APIView):
    """
        List, create, update and delete measurement devices
    """
    # Get all measurement devices
    def get(self, request):
        logger.info("{} | Get Measurement Devices Request".format(formatted_now_time()))
        measurement_devices = MeasurementDevice.objects.all()
        serializer = MeasurementDeviceSerializer(measurement_devices, many=True)
        response = serializer.data
        logger.info("{} | Get Measurement Devices Response - {}".format(formatted_now_time(), response))
        return Response(response)
