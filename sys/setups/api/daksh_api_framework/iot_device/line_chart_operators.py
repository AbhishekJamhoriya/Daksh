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
            resampled_list.append({'time': convert_datetime_to_formatted_local_timezone_2(row_dict.pop('time', None)),
                                   'data': row_dict})
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
            resampled_list.append({'time': convert_datetime_to_formatted_local_timezone_2(row_dict.pop('time', None)),
                                   'data': row_dict})
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
            resampled_list.append({'time': convert_datetime_to_formatted_local_timezone_2(i), 'data': row_dict})
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
            resampled_list.append({'time': convert_datetime_to_formatted_local_timezone_2(i), 'data': row_dict})
        return {'device_readings': resampled_list}


class Historical(Resample):
    def __init__(self, device_reading_list, aggregate_duration):
        super().__init__(device_reading_list, aggregate_duration)

    def _execute(self):
        df = self.resampled_df.first().dropna()
        df = df.reset_index(level=0, drop=True)
        resampled_list = []
        for i, row in df.iterrows():
            row_dict = dict(row)
            resampled_list.append({'time': convert_datetime_to_formatted_local_timezone_2(i), 'data': row_dict})
        return {'device_readings': resampled_list}
