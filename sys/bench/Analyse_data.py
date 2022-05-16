#!/usr/bin/env python
# coding: utf-8
import pandas as pd
import numpy as np
import json
from datetime import datetime

def analyse_influx(data_path, show_loss=False):
    df = pd.read_csv(data_path)
    duration = (df.time.max()-df.time.min())//(10**9)
    print(f'Duration = {duration} seconds')
    devices = df.groupby('ID')
    print(f'No. of devices = {len(devices)}')

    lens = []
    for device in devices:
        lens.append(len(device[1]))
    lens=np.asarray(lens)
    print(f'Mean = {lens.mean()}, Std dev= {lens.std()}')
    print(f'Lens: Min = {lens.min()}, Max = {lens.max()}')
    print('Generation variation rate = ', round((lens.max()-lens.min())/lens.min()*100, 2), '%')

    success = True
    for ID,device in devices:
        l = len(device.N1)
        M = device.N1.max()
        m = device.N1.min()
        diff = M-m
        L = diff-l
        R = L/l*100
        if L != -1: success = False
        if show_loss:
            print(f'ID = {ID}, Length = {l}, Min = {m}, Max = {M}, Diff = {diff}, Loss = {L}, Loss rate = {round(R,2)}%, Success = {success}')

    if not success: print('FAILED! DATA LOST')
    else: print('SUCCESS! NO DATA LOSS')

def analyse_influx_time(path, seconds=60, show_loss=False):
    df = pd.read_csv(path)
    duration = (df.time.max()-df.time.min())//(10**9)
    print(f'Duration = {duration} seconds')
    devices = df.groupby('ID')
    print(f'No. of devices = {len(devices)}')

    success = True
    for ID, device in devices:
        maximum = device.time.max()
        minimum = maximum - seconds * (10**9)
        device = device[device.time>minimum]
        #print(device)
        device = device[device.time<maximum]
        #print(device)
        l = len(device)
        d = seconds + 1 - l
        if d != 0: success = False
        if show_loss:
            print(f'ID = {ID}, Length = {l}\n\
Max = {maximum} = {datetime.fromtimestamp(maximum//(10**9))}\n\
Min = {minimum} = {datetime.fromtimestamp(minimum//(10**9))}\n\
Loss = {d}, Loss rate = {round(100*d/l,2)}%,\n\
Success = {success}\n')
    if not success: print('FAILED! TIMESTAMP MISSED')
    else: print('SUCCESS! NO TIMESTAMP MISSED')

def analyse_pg(data_path, show_loss=False):
    df = pd.read_csv(data_path, header=None, index_col=5)
    df = df.drop([0, 3, 4], axis=1)
    df = df.rename({1:'time', 2:'Value'}, axis='columns')
    #df = df.rename({2:'Value'}, axis='columns')
    df.index.names = ['ID']
    df.time = df.time.apply(lambda x: datetime.timestamp(datetime.strptime(x[:-3], '%Y-%m-%d %H:%M:%S.%f')))
    duration = int(df.time.max()-df.time.min())
    print(f'Duration = {duration} seconds')
    df = df.drop(['time'], axis=1)
    df = df.groupby(df.index)

    print(f'No. of devices = {len(df)}')

    lens = []
    for device in df:
        lens.append(len(device[1]))
    lens=np.asarray(lens)
    print(f'Mean = {lens.mean()}, Std dev= {lens.std()}')
    print(f'Min = {lens.min()}, Max = {lens.max()}')
    print('Generation variation rate = ', round((lens.max()-lens.min())/lens.min()*100, 2), '%')

    success = True
    for ID,device in df:
        device = device.apply(lambda x: json.loads(x[0])['N1'], axis=1)
        l = len(device)
        m = device.max()
        L = m-l
        R = L/l*100
        if L != 0: success = False
        if show_loss:
            print(f'ID = {ID}, Length = {l}, Max = {m}, Loss = {L}, Loss rate = {round(R,2)}%, Success = {success}')

    if not success: print('FAILED! DATA LOST')
    else: print('SUCCESS! NO DATA LOSS')



## check at every timestep if next vakue is late
# for i,device in devices:
#     break
# device = device.sort_values('time')
# device = device.time.reset_index().drop(['index'], axis=1)
# miss = 0
# extra = 0
# total = len(device.time)-1
# for i in range(len(device.time)-1):
#     a = datetime.fromtimestamp(device.time[i+1]/(10**9))
#     b = datetime.fromtimestamp(device.time[i]/(10**9))
#     d = a-b
#     #print(d)
#     if d<(datetime.fromtimestamp(0.5)-datetime.fromtimestamp(0)): extra+=1
#     elif d>(datetime.fromtimestamp(1.5)-datetime.fromtimestamp(0)): miss+=1
# print(miss,extra,total)
