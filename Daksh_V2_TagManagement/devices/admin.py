from django.contrib import admin
from devices.models import Equipment, MeasurementDevice


class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'capacity', 'underload_limit', 'overload_limit', 'total_life_hrs', 'enabled',
                    'created_at', 'modified_at')
    list_filter = ('name', 'enabled', 'created_at', 'modified_at')
    search_fields = ('name',)
    readonly_fields = ('created_at', 'modified_at')


class MeasurementDeviceAdmin(admin.ModelAdmin):
    list_display = ('equipment', 'sld_id', 'device_id', 'name', 'description', 'enabled', 'created_at', 'modified_at')
    list_filter = ('equipment', 'device_id', 'name', 'enabled', 'created_at', 'modified_at')
    search_fields = ('equipment__name', 'sld_id', 'device_id', 'name')
    readonly_fields = ('created_at', 'modified_at')


admin.site.register(Equipment, EquipmentAdmin)
admin.site.register(MeasurementDevice, MeasurementDeviceAdmin)
