import json
import asyncio
from influxdb.resultset import ResultSet
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect, Query
from websockets.exceptions import ConnectionClosedOK
from influxdb import InfluxDBClient
from logging.config import dictConfig
import logging
from .config import LogConfig
from typing import List, Optional
from datetime import datetime
from dateutil import tz
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
import random

import numpy as np
import pandas as pd

ws = {}
data = {}

app = FastAPI()

dictConfig(LogConfig().dict())
logger = logging.getLogger("app")

with open('/code/app/measurements.json', 'r') as file:
    measurements = iter(json.loads(file.read()))

client = InfluxDBClient(host='influxdb', port=8086, username='telegraf',
                        password='avl_influxdb123!@#', database='iot_device')


@app.get("/")
def read_root(request: Request):
    return {"Hello": "Welcome to Daksh V2 Websocket Server"}


@app.websocket("/ws/test")
async def websocket_endpoint(websocket: WebSocket):
    client_host = websocket.client.host
    logger.info("Client Host - {}".format(client_host))
    try:
        await websocket.accept()
        logger.info("Connection Request Accepted")
        while True:
            await asyncio.sleep(0.1)
            payload = next(measurements)
            await websocket.send_json(payload)
    except (ConnectionClosedOK, WebSocketDisconnect):
        logger.info("Connection Closed")
    except Exception as e:
        logger.error("Exception - {}".format(e))


@app.websocket("/ws/v1/live_data")
async def websocket_endpoint_live_data_v1(websocket: WebSocket, topics: str, channels: Optional[str] = Query('*')):
    client_host = websocket.client.host
    logger.info("Client Host - {}".format(client_host))
    try:
        await websocket.accept()
        logger.info("Connection Request Accepted")
        query = "SELECT topic, {} FROM device_readings WHERE topic =~ /{}/ AND time > now() - 10s GROUP BY topic " \
                "ORDER BY time DESC LIMIT 1".format(channels, topics.replace(',', '|'))
        logger.info("Query - {}".format(query))
        while True:
            await asyncio.sleep(1)
            rs = client.query(query=query)
            device_readings = list(rs.get_points(measurement='device_readings'))
            updated_device_readings = convert_device_readings_to_local_timezone(device_readings)
            await websocket.send_json(updated_device_readings)
    except (ConnectionClosedOK, WebSocketDisconnect) as e:
        logger.info("Connection Closed")
    except Exception as e:
        logger.error("Exception - {}".format(e))


@app.websocket("/ws/v2/live_data")
async def websocket_endpoint_live_data_v2(websocket: WebSocket):
    client_host = websocket.client.host
    logger.info("Client Host - {}".format(client_host))
    t1 = datetime.now()
    try:
        await websocket.accept()
        logger.info("Connection Request Accepted")
        data = await websocket.receive_json()
        t_request_data_received = datetime.now()
        if data:
            query_list = []
            for each in data:
                topic = each.get('topic')
                channels = each.get('channels')

                query = "SELECT topic,{} FROM device_readings WHERE topic = '{}'".format(channels, topic)
                #query = "SELECT topic,{} FROM device_readings WHERE topic = '{}' AND time > now() - 2s ORDER BY time DESC LIMIT 1".format(channels, topic)
                #query = "SELECT topic,{} FROM device_readings WHERE topic = '{}' AND time > now() - 2s " \
                #        "ORDER BY time DESC LIMIT 1".format(channels, topic)
                query_list.append(query)
            query = "; ".join(query_list)
            logger.info("Query - {}".format(query))
            t_starting_queries = datetime.now()
            while True:
                rs_list = client.query(query=query)
                rs_list = [rs_list] if isinstance(rs_list, ResultSet) else rs_list
                response_list = []
                for rs in rs_list:
                    device_readings = list(rs.get_points(measurement='device_readings'))
                    local_tz_device_readings = convert_device_readings_to_local_timezone(device_readings)
                    response_list.extend(local_tz_device_readings)
                await websocket.send_json(response_list)
                await asyncio.sleep(1)
    except (ConnectionClosedOK, WebSocketDisconnect) as e:
        logger.info("Connection Closed")
    except Exception as e:
        logger.error("Exception - {}".format(e))


@app.websocket("/ws/v3/live_data")
async def websocket_endpoint_live_data_v3(websocket: WebSocket):
    client_host = websocket.client.host
    logger.info("Client Host - {}".format(client_host))
    try:
        await websocket.accept()
        logger.info("Connection Request Accepted")
        while True:
            data = await websocket.receive_json()
            if data:
                query_list = []
                for each in data:
                    topic = each.get('topic')
                    channels = each.get('channels')
                    query = "SELECT topic,{} FROM device_readings WHERE topic = '{}' AND time > now() - 1s " \
                            "ORDER BY time DESC LIMIT 1".format(channels, topic)
                    query_list.append(query)
                query = "; ".join(query_list)
                logger.info("Query - {}".format(query))
                await asyncio.sleep(1)
                rs_list = client.query(query=query)
                rs_list = [rs_list] if isinstance(rs_list, ResultSet) else rs_list
                response_list = []
                for rs in rs_list:
                    device_readings = list(rs.get_points(measurement='device_readings'))
                    local_tz_device_readings = convert_device_readings_to_local_timezone(device_readings)
                    response_list.extend(local_tz_device_readings)
                await websocket.send_json(response_list)
    except (ConnectionClosedOK, WebSocketDisconnect) as e:
        logger.info("Connection Closed")
    except Exception as e:
        logger.error("Exception - {}".format(e))

async def f(query, websocket, job_id, scheduler):
    #global scheduler
    t1=datetime.now()
    rs_list = client.query(query=query)
    t1_1=datetime.now()
    data[job_id].append(rs_list)
    #logger.info("isinstance(rs_list, ResultSet): ", isinstance(rs_list, ResultSet))
    rs_list = [rs_list] if isinstance(rs_list, ResultSet) else rs_list
    response_list = []
    for rs in rs_list:
        device_readings = list(rs.get_points(measurement='device_readings'))
        local_tz_device_readings = convert_device_readings_to_local_timezone(device_readings)
        response_list.extend(local_tz_device_readings)

    #logger.info(websocket.__dict__)
    #logger.info(websocket.client_state)
    t2 = datetime.now()
    try:
        await websocket.send_json(response_list)
        t3 = datetime.now()
        logger.info('Query duration : {} and processing duration : {}, start={}, querier={}, processed={}, pushed={}. Total duration : {}'.format(t1_1-t1, t1_1, t2-t1, t1, t2, t3, t3-t1))
    except (ConnectionClosedOK, WebSocketDisconnect) as e:
        scheduler.remove_job('client_{}'.format(job_id))
        #logger.info(websocket.client_state)
        logger.info("JOB : Connection Closed")
        scheduler.shutdown()
    except Exception as e:
        scheduler.remove_job('client_{}'.format(job_id))
        #logger.info(websocket.client_state)
        logger.error("JOB : Exception : {}".format(e))
        scheduler.shutdown()
    #websocket.send_json(response_list)

@app.websocket("/ws/v4/live_data")
async def websocket_endpoint_live_data_v4(websocket: WebSocket):
    client_host = websocket.client.host
    logger.info("Client Host - {}".format(client_host))
    try:
        await websocket.accept()
        logger.info("Connection Request Accepted")
        data = await websocket.receive_json()
        t_request_data_received = datetime.now()
        if data:
            query_list = []
            for each in data:
                topic = each.get('topic')
                channels = each.get('channels')

                query = "SELECT topic,{} FROM device_readings WHERE topic = '{}' AND time >= now()-1s ".format(channels, topic)
                query_list.append(query)
            query = "; ".join(query_list)
            #logger.info("Query - {}".format(query))
            t_starting_queries = datetime.now()
            job_id = random.randint(1,10000)
            data.update({job_id,[]})
            scheduler = AsyncIOScheduler({'apscheduler.job_defaults.max_instances': 1})
            scheduler.add_job(f, 'interval', seconds=1, args=(query, websocket, job_id, scheduler), id='client_{}'.format(job_id))
            scheduler.start() 
        while True: await asyncio.sleep(1)
    except (ConnectionClosedOK, WebSocketDisconnect) as e:
        scheduler.remove_job('client_{}'.format(job_id))
        logger.info("Connection Closed")
        scheduler.shutdown()
    except Exception as e:
        scheduler.remove_job('client_{}'.format(job_id))
        logger.error("Exception - {}".format(e))
        scheduler.shutdown()

def convert_device_readings_to_local_timezone(device_readings):
    updated_device_readings = []
    from_zone = tz.tzutc()
    to_zone = tz.tzlocal()
    for each_dict in device_readings:
        utc = datetime.strptime(each_dict.get('time'), '%Y-%m-%dT%H:%M:%S.%fZ').replace(tzinfo=from_zone)
        local_time = utc.astimezone(to_zone).strftime('%Y-%m-%d %H:%M:%S.%f')
        logger.info("time format: {}, {}".format(local_time, utc))
        each_dict['time'] = local_time
        updated_device_readings.append(each_dict)
    return updated_device_readings
