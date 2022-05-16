import devices.views as views
from django.conf.urls import url


urlpatterns = [
    url(r'^api/v1/equipments/$', views.Equipments.as_view()),
    url(r'^api/v1/measurement_devices/$', views.MeasurementDevices.as_view()),
]
