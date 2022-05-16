from django import forms
from .models import Report

class ReportData(forms.Form):
	class meta:
		model = Report
		fields = '__all__'