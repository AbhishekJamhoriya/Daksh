import logging
import pandas as pd

logger = logging.getLogger('django')


class BaseOperator(object):
    def __init__(self, device_reading_list):
        self.df_with_time = pd.json_normalize(device_reading_list)
        self.df_with_time.columns = self.df_with_time.columns.str.replace('data.', '')
        self.df_without_time = self.df_with_time.drop(['time'], axis=1)

    def execute(self):
        result = self._execute()
        return result

    def _execute(self):
        raise NotImplementedError()


class Sum(BaseOperator):
    def __init__(self, device_reading_list):
        super().__init__(device_reading_list)

    def _execute(self):
        df = self.df_without_time.groupby('device_id', as_index=False).sum()
        df = df.astype(object).where(pd.notnull(df), None)
        return {'data': df.to_dict('records')}


class Mean(BaseOperator):
    def __init__(self, device_reading_list):
        super().__init__(device_reading_list)

    def _execute(self):
        df = self.df_without_time.groupby('device_id', as_index=False).mean()
        df = df.astype(object).where(pd.notnull(df), None)
        return {'data': df.to_dict('records')}


class Min(BaseOperator):
    def __init__(self, device_reading_list):
        super().__init__(device_reading_list)

    def _execute(self):
        df = self.df_without_time.groupby('device_id', as_index=False).min()
        df = df.astype(object).where(pd.notnull(df), None)
        return {'data': df.to_dict('records')}


class Max(BaseOperator):
    def __init__(self, device_reading_list):
        super().__init__(device_reading_list)

    def _execute(self):
        df = self.df_without_time.groupby('device_id', as_index=False).max()
        df = df.astype(object).where(pd.notnull(df), None)
        return {'data': df.to_dict('records')}


class Difference(BaseOperator):
    def __init__(self, device_reading_list):
        super().__init__(device_reading_list)

    def _execute(self):
        # df = self.df_without_time.groupby('device_id').max() - self.df_without_time.groupby('device_id').min()
        df = self.df_with_time.sort_values(['time']).groupby(['device_id'])
        df = df.last() - df.first()
        df = df[df.columns.difference(['time'])]  # Select all columns, except one ‘time’ column in Pandas Dataframe
        df = df.astype(object).where(pd.notnull(df), None)
        return {'data': df.reset_index().to_dict('records')}


class Uptime(BaseOperator):
    def __init__(self, device_reading_list):
        super().__init__(device_reading_list)

    def _execute(self):
        list_to_return = []
        df_groups = self.df_with_time.fillna(0).groupby('device_id', as_index=False)
        for device_id, df in df_groups:
            # index_to_skip = 0
            for index, row in df.iterrows():
                for col_name in df.columns:
                    if index > df.index[0] and 'time' not in col_name and 'device_id' not in col_name:
                        new_col_name = col_name + '_time_diff'

                        # Initialize new column to assign running time diff
                        if new_col_name not in df.columns:
                            df[new_col_name] = 0

                        # Calculate time difference only when previous value is non-zero
                        if df[col_name][index - 1] != 0:
                            df[new_col_name][index] = df['time'][index] - df['time'][index - 1]

                        # col_value = row[col_name]
                        # if col_value == 0:
                        #     index_to_skip = index + 1
                        # elif index == index_to_skip:
                        #     continue
                        # else:
                        #     df[new_col_name][index] = df['time'][index] - df['time'][index - 1]

            time_diff_cols = [col_name for col_name in df.columns if 'time_diff' in col_name]
            df[time_diff_cols] = df[time_diff_cols].apply(pd.to_timedelta, errors='coerce')

            dict_to_return = {time_diff_col.split('_')[0]: str(df[time_diff_col].sum(skipna=True))
                              for time_diff_col in time_diff_cols}
            dict_to_return['device_id'] = device_id
            list_to_return.append(dict_to_return)

        return {'data': list_to_return}



