import psycopg2
import pandas as pd
from flask import Flask,request
from flask_cors import CORS
import operator


#===== This file fetch data from Postgresql and send data to frontend using API     =================
#===== File contain 3 API. Two for pie charts (Equipments and Top Alarm) and one for bar chart ======
app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return 'Hello, World!'

connection = psycopg2.connect(
    host="localhost",
    database="postgres",
    user="postgres",
    password="Charger.123"
)
cur = connection.cursor()


def connect(connection):
    """ Connect to the PostgreSQL database server """
    conn = connection
    try:
        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**connection)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    print("Connection successful")
    return conn
def postgresql_to_dataframe(conn, select_query, column_names):
    """
    Tranform a SELECT query into a pandas dataframe
    """
    cursor = conn.cursor()
    try:
        cursor.execute(select_query)
    except (Exception, psycopg2.DatabaseError) as error:
        print("Error: %s" % error)
        cursor.close()
        return 1

    # Naturally we get a list of tupples
    tupples = cursor.fetchall()
    cursor.close()

    # We just need to turn it into a pandas dataframe
    df = pd.DataFrame(tupples, columns=column_names)
    return df
conn = connect(connection)
column_name = ["Date/Time", "MsgNr", "Event" , "Message Class" , "Message Type" , "MessageStatus" , "Resolution" , "id"]
df = postgresql_to_dataframe(conn, '''select * from Public."alarmdata"''', column_name)
df = df.iloc[1: , :]
df[['date', 'time']] = df['Date/Time'].str.split(' ', 1, expand=True)
df['Date/Time'] = pd.to_datetime(df['Date/Time'],dayfirst=True)
df['date'] = pd.to_datetime(df['date'],dayfirst=True)
df[['Equipment_no', 'Alarm type']] = df['Event'].str.split('_', 1, expand=True)


#========== top-alarm-equipments =============================
@app.route("/top-alarm-equipments",methods=["GET","POST"])
def pie_equipment():
    date = request.get_json()
    start_date = date['start_date']
    end_date = date['end_date']
    start_date = pd.to_datetime(start_date,dayfirst=True)
    end_date = pd.to_datetime(end_date,dayfirst=True)
    df1=df.loc[(df['Date/Time'] > start_date) & (df['Date/Time'] < end_date)]
    count = df1['Equipment_no'].value_counts()
    count = count.to_dict()
    array = []
    items = {}
    for i in count:
        items= {}
        items["tag"] = i
        items["id"] = count[i]
        array.append(items)
    return {"result":array[:5]}

#==================top-frequent-alarms =====================
@app.route('/top-frequent-alarms',methods=['GET','POST'])
def pie_alarm():
    date = request.get_json()
    start_date = date['start_date']
    end_date = date['end_date']
    start_date = pd.to_datetime(start_date,dayfirst=True)
    end_date = pd.to_datetime(end_date,dayfirst=True)
    df1=df.loc[(df['Date/Time'] > start_date) & (df['Date/Time'] < end_date)]
    count = df1['Alarm type'].value_counts()
    count = count.to_dict()
    array = []
    items = {}
    for i in count:
        items= {}
        items["tag"] = i
        items["id"] = count[i]
        array.append(items)
    if(len(array)<5):
        return{"result":array}
    else:
        return {"result":array[:5]}

#================= alarm-frequency ========================
@app.route('/alarm-frequency',methods=['POST','GET'])
def final1():
    date = request.get_json()
    start = date['start']
    end=date['end']
    start = pd.to_datetime(start,dayfirst=True).date()
    end = pd.to_datetime(end,dayfirst=True).date()
    df1 = pd.date_range(start, end)
    df2 = df1.map(df["date"].value_counts()).fillna(0).astype(int)
    dataset = pd.DataFrame({'date': df1, 'frequency': list(df2)}, columns=['date', 'frequency'])
    # # dataset['new_date_column'] = dataset['date'].dt.date
    # # dataset['new_date_column'] = pd.to_datetime(dataset['date'],dayfirst=True).dt.date
    # # dataset['new_date_column'] = pd.to_datetime(dataset['new_date_column'],dayfirst=True)
    # #dataset['new_date_column'] = pd.to_datetime(dataset.date).dt.strftime('%d/%m/%Y')
    array_new = []
    items_new = {}
    for i in dataset.index:
        items_new= {}
        items_new["tag"] = str(dataset['date'][i])
        items_new["count"] = str(dataset['frequency'][i])
        items_new["id"]=i+1
        array_new.append(items_new)
    return{"result":array_new}


connection.commit()
cur.close()
connection.close()

if(__name__ == "__main__"):
    app.run(debug=True)
