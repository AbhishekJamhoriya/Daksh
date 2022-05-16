import psycopg2
import pandas as pd
from flask import Flask,request
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
 #==========  this file save data to postgresql after taking resolution from frontend =============
@app.route("/")
def hello_world():
    return 'Hello, World!'
connection = psycopg2.connect(
    host="postgres",
    database="postgres",
    user="postgres",
    password="postgres"
)
#password- postgres
connection.autocommit = True
cur = connection.cursor()

#========= alarm-resolution =======================
@app.route('/alarm-resolution',methods=['GET','POST'])
def update():
    res =  request.get_json()
    array = []
    items = {}
    for key in res:
        value = res[key]
        cur.execute( '''UPDATE public.alarmdata SET "Resolution" = (%s) WHERE "id" = (%s) ''',(value,key))
        items= {}
        items["id"] = key
        items["resolution"] = value
        array.append(items)
        print(array)
    return{"return" : array}
if(__name__ == "__main__"):
    app.run(port=5050)
connection.commit()
cur.close()
connection.close()
