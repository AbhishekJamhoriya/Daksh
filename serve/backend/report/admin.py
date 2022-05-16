from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from django.contrib import admin
from .models import Report
from .models import Schedule

# class ReportAdmin(ImportExportModelAdmin):
#     list_display = ('Date', 'Energy(kWh)')

class ReportAdmin(admin.ModelAdmin):
    # a list of displayed columns name.
    list_display = ['date_time', 'device', 'frequency', 'voltage_ph1', 'voltage_ph2', 'voltage_ph3', 'voltage_ph1_ph2', 'voltage_ph2_ph3', 'voltage_ph3_ph1', 'current_ph1', 'current_ph2', 'current_ph3', 'cuurent_avg', 'active_power', 'total_energy', 'power_factor', 'thd_voltage', 'thd_current_i1', 'thd_current_i2', 'thd_current_i3', 'import_energy', 'export_energy', 'date_time_min', 'date_time_py']

admin.site.register(Report, ReportAdmin)


class ReportAdmin(admin.ModelAdmin):
    # a list of displayed columns name.
    list_display = ['scheduling_time','report_type','frequency','duration']
admin.site.register(Schedule, ReportAdmin)





