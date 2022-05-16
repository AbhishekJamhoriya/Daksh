from datetime import datetime
from pytz import timezone
from django.conf import settings


pretty_datetime_format = "%d-%m-%Y %H:%M:%S"
pretty_datetime_format_2 = "%Y-%m-%d %H:%M:%S"


def convert_datetime_to_local_timezone(datetime_obj):
    return datetime_obj.astimezone(timezone(settings.TIME_ZONE)) if isinstance(datetime_obj, datetime) else None


def convert_datetime_to_formatted_local_timezone(datetime_obj):
    return datetime_obj.astimezone(timezone(settings.TIME_ZONE)).strftime(pretty_datetime_format) if \
        isinstance(datetime_obj, datetime) else None


def convert_datetime_to_formatted_local_timezone_2(datetime_obj):
    return datetime_obj.astimezone(timezone(settings.TIME_ZONE)).strftime(pretty_datetime_format_2) if \
        isinstance(datetime_obj, datetime) else None


def now_time():
    return datetime.now().astimezone(timezone(settings.TIME_ZONE))


def formatted_now_time():
    return datetime.now().astimezone(timezone(settings.TIME_ZONE)).strftime(pretty_datetime_format)


def convert_epoch_timestamp_to_datetime(epoch):
    return datetime.fromtimestamp(float(epoch)/1000).astimezone(timezone(settings.TIME_ZONE))


def convert_epoch_timestamp_to_formatted_datetime(epoch):
    return datetime.fromtimestamp(float(epoch)/1000).astimezone(timezone(settings.TIME_ZONE)).\
        strftime(pretty_datetime_format)


def convert_formatted_datetime_to_datetime(datetime_str):
    return datetime.strptime(datetime_str, pretty_datetime_format_2)


def calculate_time_difference(start_datetime_obj, end_datetime_obj):
    return (end_datetime_obj - start_datetime_obj).total_seconds()
