"""importexport URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    # path('export/', views.export),
    path('', views.EnergyListView.as_view()),
    path('<pk>', views.EnergyDetailView.as_view()),
    path('create/', views.EnergyCreateView.as_view()),
    path('<pk>/update/', views.EnergyUpdateView.as_view()),
    # path('check/', views.make_report),
    path('getreport/', views.PostReport.as_view()),
    path('schedule-report/',views.ScheduleReportView.as_view()),
    path('get-devices/',views.GetEnergyDevices.as_view()),
    path('get-schedule/',views.ScheduleView.as_view()),
    path('start-scheduler/',views.StartScheduler.as_view()),
]