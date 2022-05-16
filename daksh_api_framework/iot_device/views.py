import logging
from pandas.tseries.frequencies import to_offset
from django.db.models import F
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from iot_device.models import DeviceReading
from iot_device.utils import formatted_now_time, convert_formatted_datetime_to_datetime, calculate_time_difference, \
    convert_datetime_to_formatted_local_timezone_2
import iot_device.pie_chart_operators as all_pie_chart_operators
import iot_device.line_chart_operators as all_line_chart_operators
import iot_device.bar_chart_operators as all_bar_chart_operators


logger = logging.getLogger('django')


class CustomAPIException(ValidationError):
    """
    raises API exceptions with custom messages and custom status codes
    """
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'error'

    def __init__(self, detail, status_code=None):
        self.detail = detail
        if status_code is not None:
            self.status_code = status_code


class QueryDeviceReadings(APIView):
    def post(self, request):
        """
        {
          "device_ids": "001,002",
          "channels": "N1,N2",
          "start_date": "2021-12-21 18:10:00",
          "end_date": "2021-12-21 18:30:00",
          "graph_type": "line",
          "aggregate_function": "Min",
          "aggregate_duration": "5S"
        }
        """
        req_data = request.data
        logger.info("{} | Query Device Readings Request - {}".format(formatted_now_time(), req_data))
        device_ids = req_data.get('device_ids', None)
        channels = req_data.get('channels', None)
        channel_list = channels.split(',') if channels is not None else []
        start_date = req_data.get('start_date', None)
        end_date = req_data.get('end_date', None)
        graph_type = req_data.get('graph_type', None)
        aggregate_function = req_data.get('aggregate_function', None)
        aggregate_duration = req_data.get('aggregate_duration', None)
        no_of_bars = req_data.get('no_of_bars', None)

        # Request data validations
        if device_ids is None:
            response_dict = {"status": False, "message": "Device ID not provided"}
            raise CustomAPIException(detail=response_dict, status_code=status.HTTP_400_BAD_REQUEST)

        if ":" in device_ids:
            zfill_length = len(device_ids.split(":")[0])
            start = int(device_ids.split(":")[0])
            stop = int(device_ids.split(":")[1])
            device_id_list = [str(i).zfill(zfill_length) for i in range(start, stop+1)]
        else:
            device_id_list = device_ids.split(',')

        if graph_type is not None and graph_type not in ["pie", "line", "bar"]:
            response_dict = {"status": False, "message": "{} chart is not supported".format(graph_type)}
            raise CustomAPIException(detail=response_dict, status_code=status.HTTP_400_BAD_REQUEST)

        if graph_type == "line":
            if start_date is None or end_date is None:
                response_dict = {"status": False, "message": "Start date or end date not provided"}
                raise CustomAPIException(detail=response_dict, status_code=status.HTTP_400_BAD_REQUEST)

            if aggregate_duration is None:
                response_dict = {"status": False, "message": "Aggregate duration not provided"}
                raise CustomAPIException(detail=response_dict, status_code=status.HTTP_400_BAD_REQUEST)
            try:
                to_offset(aggregate_duration)
            except ValueError:
                response_dict = {"status": False, "message": "Invalid aggregate duration - {}".format(
                    aggregate_duration)}
                raise CustomAPIException(detail=response_dict, status_code=status.HTTP_400_BAD_REQUEST)

        if graph_type == "bar":
            if start_date is None or end_date is None:
                response_dict = {"status": False, "message": "Start date or end date not provided"}
                raise CustomAPIException(detail=response_dict, status_code=status.HTTP_400_BAD_REQUEST)

            if no_of_bars is None:
                response_dict = {"status": False, "message": "No. of bars not provided"}
                raise CustomAPIException(detail=response_dict, status_code=status.HTTP_400_BAD_REQUEST)
            try:
                bar_count = int(no_of_bars)
            except ValueError:
                response_dict = {"status": False, "message": "No. of bars provided are invalid"}
                raise CustomAPIException(detail=response_dict, status_code=status.HTTP_400_BAD_REQUEST)

            end_datetime_obj = convert_formatted_datetime_to_datetime(end_date)
            start_datetime_obj = convert_formatted_datetime_to_datetime(start_date)
            time_diff_seconds = calculate_time_difference(start_datetime_obj=start_datetime_obj,
                                                          end_datetime_obj=end_datetime_obj)
            try:
                aggregate_duration_seconds = round(time_diff_seconds/bar_count)
            except Exception as e:
                error_msg = "Error occurred while calculating aggregate duration for bar chart"
                logger.error("{} | {} - {}".format(formatted_now_time(), error_msg, e))
                response_dict = {"status": False, "message": error_msg}
                raise CustomAPIException(detail=response_dict, status_code=status.HTTP_400_BAD_REQUEST)
            aggregate_duration = "{}S".format(aggregate_duration_seconds)

        # Data query and computation
        device_reading_list = []

        # Return latest device reading if start date or end date is not provided
        if start_date is None or end_date is None:
            latest_device_readings = DeviceReading.objects.filter(device__device_id__in=device_id_list).\
                order_by('device__device_id', '-time').distinct('device__device_id')

            if not latest_device_readings:
                response_dict = {"status": False, "message": "Data unavailable"}
                raise CustomAPIException(detail=response_dict, status_code=status.HTTP_204_NO_CONTENT)

            # Fetch data of only those channels which are provided in request, otherwise all channels
            for latest_device_reading in latest_device_readings:
                latest_device_reading_data = {k: latest_device_reading.data.get(k, None) for k in channel_list} \
                    if channel_list else latest_device_reading.data
                device_reading_list.append({
                    "device_id": latest_device_reading.device.device_id,
                    "time": convert_datetime_to_formatted_local_timezone_2(latest_device_reading.time),
                    "data": latest_device_reading_data
                })

            response_dict = {"status": True, "device_readings": device_reading_list}

        # Filter data between start and end date
        else:
            device_readings = DeviceReading.objects.filter(device__device_id__in=device_id_list,
                                                           created_at__range=(start_date, end_date))

            if not device_readings:
                response_dict = {"status": False, "message": "Data unavailable"}
                raise CustomAPIException(detail=response_dict, status_code=status.HTTP_204_NO_CONTENT)

            # No operation, therefore, return raw data
            if aggregate_function is None:
                for device_reading in device_readings:
                    # Fetch data of only those channels which are provided in request, otherwise all channels
                    device_reading_data = {k: device_reading.data.get(k, None) for k in channel_list} if channel_list \
                        else device_reading.data
                    device_reading_list.append({
                        "device_id": device_reading.device.device_id,
                        "time": convert_datetime_to_formatted_local_timezone_2(device_reading.time),
                        "data": device_reading_data
                    })

                response_dict = {"status": True, "device_readings": device_reading_list}

            # Some operation like sum, mean, min, max, etc. needs to be performed on the basis of graph type
            else:
                device_reading_list = list(device_readings.order_by('device__device_id', 'time').values('data', 'time').
                                           annotate(device_id=F('device__device_id')))
                if channel_list:
                    filtered_device_reading_list = []
                    for device_reading_dict in device_reading_list:
                        temp_dict = {'device_id': device_reading_dict.get('device_id'),
                                     'time': device_reading_dict.get('time'), 'data': {}}
                        for ch in channel_list:
                            temp_dict['data'][ch] = device_reading_dict.get('data', {}).get(ch, None)
                        filtered_device_reading_list.append(temp_dict)
                else:
                    filtered_device_reading_list = device_reading_list

                # Compute data on the basis of graph type
                response_dict = compute_data(
                    device_reading_list=filtered_device_reading_list, graph_type=graph_type,
                    aggregate_function=aggregate_function, aggregate_duration=aggregate_duration
                )

                if not response_dict.get('status', False):
                    logger.info("{} | Query Device Readings Response - {}".format(formatted_now_time(), response_dict))
                    raise CustomAPIException(detail=response_dict, status_code=status.HTTP_400_BAD_REQUEST)

        logger.info("{} | Query Device Readings Response - {}".format(formatted_now_time(), response_dict))
        return Response(response_dict)


def compute_data(device_reading_list, graph_type, aggregate_function, aggregate_duration):
    try:
        # In case of pie chart we need to return single aggregated value of each requested channel
        if graph_type is None or graph_type == "pie":
            operator_class = getattr(all_pie_chart_operators, aggregate_function)(
                device_reading_list=device_reading_list)
            result_dict = operator_class.execute()
            status_dict = {"status": True}
            response_dict = {**status_dict, **result_dict}

        elif graph_type == "line":
            # In case of line chart we need to return aggregated values of each requested channel over a
            # duration which is provided in request
            operator_class = getattr(all_line_chart_operators, aggregate_function)(
                device_reading_list=device_reading_list, aggregate_duration=aggregate_duration)
            result_dict = operator_class.execute()
            status_dict = {"status": True}
            response_dict = {**status_dict, **result_dict}

        elif graph_type == "bar":
            # In case of bar chart we need to return aggregated values of each requested channel over a
            # duration which is calculated from the no. of bars provided
            operator_class = getattr(all_bar_chart_operators, aggregate_function)(
                device_reading_list=device_reading_list, aggregate_duration=aggregate_duration)
            result_dict = operator_class.execute()
            status_dict = {"status": True}
            response_dict = {**status_dict, **result_dict}

        else:
            response_dict = {"status": False, "message": "{} chart is not supported".format(graph_type)}
    except AttributeError as e:
        logger.error("{} | {} class is not defined in operators - {}".format(formatted_now_time(),
                                                                             aggregate_function, e))
        response_dict = {"status": False, "message": "{} operation is not supported for {} chart".format(
            aggregate_function, graph_type)}
    except Exception as e:
        error_msg = "Error occurred while performing {} operation".format(aggregate_function)
        logger.error("{} | {} - {}".format(formatted_now_time(), error_msg, e))
        response_dict = {"status": False, "message": error_msg}

    return response_dict
