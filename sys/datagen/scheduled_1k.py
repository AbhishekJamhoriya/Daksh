import paho.mqtt.publish as publish
import os
import json
from datetime import datetime
from random import uniform
import time
import csv
import threading

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger

MQTT_SERVER = "10.6.0.71"
MQTT_PATH = "001"
d13=0;

i = 0
id = i

d1 = i
d2 = i
d3 = i
d4 = i
d5 = i
d6 = i
d7 = i
d8 = i
d9 = i
d10 = i
d11 = (d8+d9+d10)/3
d12 = 1.732*d5*d11/1000.0
d14 = i
d15 = i
d16 = i
d17 = i
d18 = i
d19 = d13
d20 = 0.0;

d = { "ID":id, "N1":d1,"N2":d2,"N3":d3,"N4":d4,"N5":d5,"N6":d6,"N7":d7,"N8":d8,"N9":d9,"N10":d10,"N11":d11,"N12":d12,"N13":d13,"N14":d14,"N15":d15,"N16":d16,"N17":d17,"N18":d18,"N19":d19,"N20":d20}

num_topics = 50
print(num_topics)

scheduler = BlockingScheduler()
@scheduler.scheduled_job(IntervalTrigger(seconds=1))
def generate():
    global i
    i+=1
    d1 = i
    d["N1"] = i
    t1 = datetime.now()
    for count in range(1,1+num_topics):
        id = '{0:04d}'.format(count)
        topic = id
        d['ID'] = id
        
        data = json.dumps(d)

        publish.single(topic, data, hostname=MQTT_SERVER,port=1883,client_id="espclient1",qos=1,will=None, tls=None, transport="tcp")

        if int(id)%50==25 or int(id)%50==0: print("ID = " + id + ", v = " + str(i))
    t2 = datetime.now()
    print(t2-t1)

scheduler.start()
