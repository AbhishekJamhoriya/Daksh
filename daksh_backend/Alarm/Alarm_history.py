import psycopg2
from psycopg2.extensions import AsIs
import os
import pandas as pd
import schedule
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
import shutil
import time
raw_data_folder = r'/alarm_data/dataset'
file_path = ""
  
from flask import Flask,jsonify
app = Flask(__name__)
CORS(app)
@app.route("/")
def hello_world():
    return 'Hello, World!'
connection = psycopg2.connect(
    host="postgres",
    database="postgres",
    user="postgres",
    password="postgres"
)
cur = connection.cursor()
cur.execute('''
                CREATE TABLE IF NOT EXISTS alarmdata(
                "DateTime" character varying ,
                "MsgNr" character varying ,
                "Event" character varying ,
                "MessageClass" character varying,
                "MessageType" character varying,
                "MessageStatus" character varying,
                "Resolution" character varying,
                "id" SERIAL PRIMARY KEY
            )
                ''')
def importReports():
    for base, dir,files in os.walk(raw_data_folder):
        print('Iterating in : ', base)
        for Files in files:
            file_path = base + '/' + Files
            print(file_path)
            query = f'''COPY alarmdata("DateTime","MsgNr","Event","MessageClass","MessageType","MessageStatus" ) FROM '{file_path}' DELIMITER ',' CSV HEADER'''
            cur.execute(query)
            destination_path = "/alarm_data/SPAM"
            shutil.move(file_path, destination_path)

importReports()
scheduler2 = BackgroundScheduler()
scheduler2.start()
#scheudle the file importing for every 24 hours
scheduler2.add_job(importReports, 'interval', days=1)
cur.execute('''SELECT * FROM "alarmdata"''')
row = cur.fetchall()
array3 = []
for i in row:
    items3 = {}
    items3["Date_time"] = str(pd.to_datetime(i[0]))
    a = str(i[2]).split('_', 1)
    items3["Equipment"] = a[0]
    items3["Event"] = a[1]
    items3["id"] = i[7]
    items3["Resolution"] = i[6]
    array3.append(items3)

sorted_arr=sorted(array3, key=lambda d:d['Date_time'])
@app.route("/data",methods=["GET"])
def run():
    return {"result":sorted_arr}


connection.commit()
cur.close()
connection.close()


if __name__ == '__main__':
    # app.debug = True
    app.run(port=8080)


