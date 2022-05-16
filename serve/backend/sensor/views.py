from django.db.models import Q
from .serializers import SensorSerializer
from .models import Sensor
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from datetime import datetime
import secrets
import json
import os

@permission_classes((AllowAny, ))
class SensorView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, *args, **kwargs):
        sensors = Sensor.objects.filter()
        serializer = SensorSerializer(sensors, many=True)
        return Response(serializer.data)
