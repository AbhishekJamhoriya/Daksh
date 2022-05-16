import paho.mqtt.publish as publish
import os
import json
from datetime import datetime
from random import randint
import time
import csv
import threading

MQTT_SERVER = "10.6.0.71"
MQTT_PATH = "001"
d13=0;

"""
filename = "/home/pi/em1_csv.csv"
if os.path.exists(filename):
    
    f= open(filename,'r')
    d13= f.read()
    d13 =float(d13)
else:
    pass
d21 =0
d22 =0
"""

num_threads = 2

class Thread(threading.Thread):
    def __init__(self, count):
        threading.Thread.__init__(self)
        self.thread_name = 'em100_'+str(count)
        self.thread_ID = count
 
        # helper function to execute the threads
    def run(self):
        print('thread_name = ' + str(self.thread_name) + ",  thread_ID = " +  str(self.thread_ID))

        # TODO: Check if correct
        # increment ID or MQTT_PATh=topic?
        id = '{0:03d}'.format(1+count)
        topic = id
        i = 0
        while True:
            i+=1

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

            #if d21 < d22:
               # d13 = d13+0.1;
            """
                a1=d13;
                f= open(filename,'w')
                a1=str(a1)
                f.write(a1);
                d22 = 0;
                """
            #d21 = randint(1,10)
            #
            #print(d21)
                
            #if d21 >= d22:
            #    d22 = d22 +1;
           
            d14 = i
            d15 = i
            d16 = i
            d17 = i
            d18 = i
            d19 = d13
            d20 = 0.0;
            

            # id = "001"
            print({ "ID":id, "N1":d1,"N2":d2,"N3":d3,"N4":d4,"N5":d5,"N6":d6,"N7":d7,"N8":d8,"N9":d9,"N10":d10,"N11":d11,"N12":d12,"N13":d13,"N14":d14,"N15":d15,"N16":d16,"N17":d17,"N18":d18,"N19":d19,"N20":d20})

            #publish.single(topic, data, hostname=MQTT_SERVER,port=1883,client_id="espclient1",qos=1,will=None, tls=None, transport="tcp")
            print("data sent, ID = " + id)
            time.sleep((randint(85,130)/100.0))
       
       
        #publish.single(MQTT_PATH, MSG, hostname=MQTT_SERVER,port=1883,client_id="espclient",qos=0, auth={'username':"kamal", 'password':"23021991"} ,will=None, tls=None,
        #transport="tcp")
    


threads = []
for count in range(num_threads):
    #try:
    print('thread count=' + str(count))
    threads.append(Thread(count))
    threads[count].daemon = True
    threads[count].start()
    #except KeyboardInterrupt:
    #    for i in (num_threads):
    #        threads[i].join()
    #        #threads[i].kill()
    #    sys.exit()

while True:
    time.sleep(1)

