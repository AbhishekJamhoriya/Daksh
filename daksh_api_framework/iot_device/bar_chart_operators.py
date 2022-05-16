import logging
import pandas as pd
from iot_device.utils import convert_datetime_to_formatted_local_timezone_2

logger = logging.getLogger('django')


class Resample(object):
    def __init__(self, device_reading_list, aggregate_duration):
        self.df_with_time = pd.json_normalize(device_reading_list)
        self.df_with_time.columns = self.df_with_time.columns.str.replace('data.', '')
        self.df_with_time = self.df_with_time.set_index('time').groupby('device_id')
        self.resampled_df = self.df_with_time.resample(aggregate_duration, origin='start')
        self.aggregate_duration = aggregate_duration

    def execute(self):
        result = self._execute()
        return result

    def _execute(self):
        raise NotImplementedError()


class Sum(Resample):
    def __init__(self, device_reading_list, aggregate_duration):
        super().__init__(device_reading_list, aggregate_duration)

    def _execute(self):
        df = self.resampled_df.sum().dropna()
        df.reset_index(inplace=True)
        resampled_list = []
        for i, row in df.iterrows():
            row_dict = dict(row)
            time = row_dict.pop('time', None)
            aggregate_duration_seconds = int(self.aggregate_duration[:-1])
            end_time = pd.to_datetime(time) + pd.to_timedelta(aggregate_duration_seconds, unit='s')
            bar_start_time = convert_datetime_to_formatted_local_timezone_2(time)
            bar_end_time = convert_datetime_to_formatted_local_timezone_2(end_time)
            resampled_list.append({'start_time': bar_start_time, 'end_time': bar_end_time, 'data': row_dict})
        return {'device_readings': resampled_list}


class Mean(Resample):
    def __init__(self, device_reading_list, aggregate_duration):
        super().__init__(device_reading_list, aggregate_duration)

    def _execute(self):
        df = self.resampled_df.mean().dropna()
        df.reset_index(inplace=True)
        resampled_list = []
        for i, row in df.iterrows():
            row_dict = dict(row)
            time = row_dict.pop('time', None)
            aggregate_duration_seconds = int(self.aggregate_duration[:-1])
            end_time = pd.to_datetime(time) + pd.to_timedelta(aggregate_duration_seconds, unit='s')
            bar_start_time = convert_datetime_to_formatted_local_timezone_2(time)
            bar_end_time = convert_datetime_to_formatted_local_timezone_2(end_time)
            resampled_list.append({'start_time': bar_start_time, 'end_time': bar_end_time, 'data': row_dict})
        return {'device_readings': resampled_list}


class Min(Resample):
    def __init__(self, device_reading_list, aggregate_duration):
        super().__init__(device_reading_list, aggregate_duration)

    def _execute(self):
        df = self.resampled_df.min().dropna()
        df = df.reset_index(level=0, drop=True)
        resampled_list = []
        for i, row in df.iterrows():
            row_dict = dict(row)
            time = i
            aggregate_duration_seconds = int(self.aggregate_duration[:-1])
            end_time = pd.to_datetime(time) + pd.to_timedelta(aggregate_duration_seconds, unit='s')
            bar_start_time = convert_datetime_to_formatted_local_timezone_2(time)
            bar_end_time = convert_datetime_to_formatted_local_timezone_2(end_time)
            resampled_list.append({'start_time': bar_start_time, 'end_time': bar_end_time, 'data': row_dict})
        return {'device_readings': resampled_list}


class Max(Resample):
    def __init__(self, device_reading_list, aggregate_duration):
        super().__init__(device_reading_list, aggregate_duration)

    def _execute(self):
        df = self.resampled_df.max().dropna()
        df = df.reset_index(level=0, drop=True)
        resampled_list = []
        for i, row in df.iterrows():
            row_dict = dict(row)
            time = i
            aggregate_duration_seconds = int(self.aggregate_duration[:-1])
            end_time = pd.to_datetime(time) + pd.to_timedelta(aggregate_duration_seconds, unit='s')
            bar_start_time = convert_datetime_to_formatted_local_timezone_2(time)
            bar_end_time = convert_datetime_to_formatted_local_timezone_2(end_time)
            resampled_list.append({'start_time': bar_start_time, 'end_time': bar_end_time, 'data': row_dict})
        return {'device_readings': resampled_list}


class Difference(Resample):
    def __init__(self, device_reading_list, aggregate_duration):
        super().__init__(device_reading_list, aggregate_duration)

    def _execute(self):
        df_first = self.resampled_df.first().dropna()
        df_first = df_first[df_first.columns.difference(['device_id'])]

        df_last = self.resampled_df.last().dropna()
        df_last = df_last[df_last.columns.difference(['device_id'])]

        df = df_last - df_first
        df = df.reset_index()

        resampled_list = []
        for i, row in df.iterrows():
            row_dict = dict(row)
            time = row_dict.pop('time', None)
            aggregate_duration_seconds = int(self.aggregate_duration[:-1])
            end_time = pd.to_datetime(time) + pd.to_timedelta(aggregate_duration_seconds, unit='s')
            bar_start_time = convert_datetime_to_formatted_local_timezone_2(time)
            bar_end_time = convert_datetime_to_formatted_local_timezone_2(end_time)
            resampled_list.append({'start_time': bar_start_time, 'end_time': bar_end_time, 'data': row_dict})
        return {'device_readings': resampled_list}