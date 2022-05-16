import iot_device.views as views
from django.conf.urls import url


urlpatterns = [
    url(r'^api/v1/query_device_readings/$', views.QueryDeviceReadings.as_view()),
]