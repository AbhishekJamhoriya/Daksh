from django.contrib import admin
from .models import Device, DeviceReading
from prettyjson import PrettyJSONWidget
from django.db.models import JSONField


class DeviceAdmin(admin.ModelAdmin):
    list_display = ('device_id', 'name', 'enabled', 'created_at', 'modified_at')
    list_filter = ('device_id', 'enabled', 'created_at', 'modified_at')
    search_fields = ('device_id',)
    readonly_fields = ('device_id', 'name', 'enabled', 'metadata', 'created_at', 'modified_at')


class DeviceReadingAdmin(admin.ModelAdmin):
    formfield_overrides = {
        JSONField: {'widget': PrettyJSONWidget(attrs={'initial': 'parsed'})}
    }
    list_display = ('device', 'time', 'data', 'created_at', 'modified_at')
    list_filter = ('device__device_id', 'time', 'created_at', 'modified_at')
    search_fields = ('device__device_id',)
    readonly_fields = ('device', 'time', 'created_at', 'modified_at')


admin.site.register(Device, DeviceAdmin)
admin.site.register(DeviceReading, DeviceReadingAdmin)