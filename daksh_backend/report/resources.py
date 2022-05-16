from import_export import resources
from .models import Report

class ReportResource(resources.ModelResource):
    class Meta:
        model = Report