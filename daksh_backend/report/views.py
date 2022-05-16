from dis import pretty_flags
from django.shortcuts import render
from django.http import HttpResponse
from .resources import ReportResource
from tablib import Dataset
from .models import Report, Schedule
from django.contrib import messages
import xlrd
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import matplotlib.colors as mcolors
from matplotlib.backends.backend_pdf import PdfPages
import matplotlib.backends.backend_pdf
import seaborn as sns
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView
from rest_framework.views import APIView
from .serializers import EnergySerializer, ScheduleSerializer
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
import json
import csv
import os
import schedule
import time
import threading
import numpy as np
import schedule
import time
import datetime
from collections import defaultdict
import asyncio
import random
import string
import pdfkit
from PyPDF2 import PdfFileReader, PdfFileWriter, PdfFileMerger
import shutil
import fitz


from apscheduler.schedulers.background import BackgroundScheduler
try:
    from io import BytesIO as IO  # for modern python
except ImportError:
    from io import StringIO as IO  # for legacy python
import csv
import myEnvVals
import smtplib
from email.message import EmailMessage

RAW_DATA_FOLDER = r'.\report\excel_reports'
file_path = ""
current_time = ""
id_array_equipment = []
id_array_historical_table = []
equip_id = 0
tab_id = 0

channel_name_conversion_dict = {'Frequency': 'frequency', 'Voltage Ph1': 'voltage_ph1', 'Voltage Ph2': 'voltage_ph2', 'Voltage Ph3': 'voltage_ph3', 'Voltage Ph1-Ph2': 'voltage_ph1_ph2', 'Voltage Ph2-Ph3': 'voltage_ph2_ph3', 'Voltage Ph3-Ph1': 'voltage_ph3_ph1', 'Current Ph1': 'current_ph1',
                                'Current Ph2': 'current_ph2', 'Current Ph3': 'current_ph3', 'Cuurent Average': 'cuurent_avg', 'Active Power': 'active_power', 'Total Energy': 'total_energy', 'Power Factor': 'power_factor', 'THD Voltage': 'thd_voltage', 'THD Current I1': 'thd_current_i1', 'THD Current I2': 'thd_current_i2', 'THD Current I3': 'thd_current_i3',  'Import Energy': 'import_energy', 'Export Energy': 'export_energy'}

# function to convert string to python datetime object (Input in format: 2020-09-19 08:01) (YYYY-MM-DD HH:MM)
def strToDatetime(datetime_str):
    date_and_time = datetime_str.split()
    date = date_and_time[0]
    time = date_and_time[1]
    year = int(date.split('-')[0])
    month = int(date.split('-')[1])
    day = int(date.split('-')[2]) 
    hour = int(time.split(':')[0])
    minute = int(time.split(':')[1])

    x = datetime.datetime(year, month, day, hour, minute)
    # print(x.strftime("%Y") + "-" + x.strftime("%m") + "-" + x.strftime("%d") + " " + x.strftime("%H") + " " + x.strftime("%M"))
    return x

# function to convert string to python datetime object (Input in format: 3-14-2022 0:01) (MM-DD-YYYY HH:MM)
def strToDateTimeForModel(datetime_str):
    date_and_time = datetime_str.split()
    date = date_and_time[0]
    time = date_and_time[1]
    month = int(date.split('-')[0])
    day = int(date.split('-')[1])
    year = int(date.split('-')[2]) 
    hour = int(time.split(':')[0])
    minute = int(time.split(':')[1])
    
    x = datetime.datetime(year, month, day, hour, minute)
    return x


#function to get the device name from the file name
def getDeviceName(file_name):
    cnt = 0
    device_name = ""
    for i in file_name:

        if cnt == 1:
            device_name += i
        if i == '_':
            cnt+=1
        if (cnt==2 and i=='_'):
            break

    return device_name[:-1]

#function to remove seconds from the date&time field if it exists (3-14-2022 08:02:08)
def getDateTimeMins(date_time_str):
    if date_time_str.count(':') > 1:
        date_time_str = date_time_str[:-3]
    return date_time_str

file_path = r'.\report\excel_reports'

# function to iterate through the excel_reports folder and import all csv files
def importReports():

    print("Checking for reports to import...")

    for base, dirs, files in os.walk(RAW_DATA_FOLDER):
        print('Iterating in : ', base)
        for Files in files:
            file_path = base + "\\" + Files
            if(Files != "sample_file.txt"):
                print('Importing filepath: ', file_path)
                with open(file_path) as f:
                    reader = csv.reader(f)
                    #skip the header while importing
                    next(reader)
                    for row in reader:
                        _, created = Report.objects.get_or_create(
                            date_time=row[0].replace('/', '-'),
                            device=getDeviceName(Files),
                            frequency=row[1],
                            voltage_ph1=row[2],
                            voltage_ph2=row[3],
                            voltage_ph3=row[4],
                            voltage_ph1_ph2=row[5],
                            voltage_ph2_ph3=row[6],
                            voltage_ph3_ph1=row[7],
                            current_ph1=row[8],
                            current_ph2=row[9],
                            current_ph3=row[10],
                            cuurent_avg=row[11],
                            active_power=row[12],
                            total_energy=row[13],
                            power_factor=row[14],
                            thd_voltage=row[15],
                            thd_current_i1=row[16],
                            thd_current_i2=row[17],
                            thd_current_i3=row[18],
                            import_energy=row[19],
                            export_energy=row[20],
                            date_time_min=getDateTimeMins(row[0].replace('/', '-')),
                            date_time_py=strToDateTimeForModel(getDateTimeMins(row[0].replace('/', '-')))
                        )

            if os.path.exists(file_path):
                destination_path = ".\\report\\archived_reports"
                if(file_path != ".\\report\\excel_reports\\sample_file.txt"):
                    new_location = shutil.move(file_path, destination_path)
                    print("The %s moved to the location %s" %
                        (file_path, new_location))
            else:
                print("File does not exist")

scheduler2 = BackgroundScheduler()
scheduler2.start()
#scheudle the file importing for every 24 hours
scheduler2.add_job(importReports, 'interval', days=1)

importReports()

# function to calculate the energy difference
def energyDiff(energy_start_record, energy_end_record):
    energy_start_total = 0
    energy_end_total = 0
    for key in energy_start_record:
        energy_start_total += float(energy_start_record[key])
        energy_end_total += float(energy_end_record[key])
    energy_start_total = round(energy_start_total, 2)
    energy_end_total = round(energy_end_total, 2)

    return round(energy_end_total - energy_start_total, 2)

# function to make graphs
# def plotGraph(final_hist_df, selected_device, selected_channel, start_datetime, end_datetime, minimum, maximum, record_avg):
#     graph = sns.lineplot(x="Date & Time", y="Values",  data = final_hist_df, color = 'purple')
#     ax = plt.gca()
#     ax.set_xticklabels(ax.get_xticklabels(), rotation=40, ha="right")
#     plt.tight_layout()
#     plt.title(f'{selected_device}:{selected_channel} \n From {start_datetime} To {end_datetime}')
#     graph.axhline(minimum,  color='r', label = 'min')
#     graph.axhline(maximum,  color='tab:blue', label = 'max')
#     graph.axhline(record_avg,  color='g', label = 'avg')
#     plt.rcParams.update({'font.size': 10})
#     plt.subplots_adjust(top=0.88)
#     return graph

# function to generate raw data report


def generateRawDataReport(start_date_time_min, end_date_time_min, device_channel_list):

    empty_df = pd.DataFrame()
    dataframe_columns = [empty_df]
    channel_device_names = []
    df_datetime_column = pd.DataFrame()
    column_names_db = []

    device_channel_dict = defaultdict(list)
    for obj in device_channel_list:
        device_channel_dict[obj.get('Device')].append(obj.get('Channel'))

    for selected_device in device_channel_dict:
        device_channels = device_channel_dict.get(selected_device)
        for selected_channel in device_channels:
            selected_channel_db = channel_name_conversion_dict.get(
                selected_channel)
            column_names_db.append(selected_channel_db)
            start_datetime = strToDatetime(start_date_time_min)
            end_datetime = strToDatetime(end_date_time_min)
            date_time_column = Report.objects.filter(date_time_py__range=[
                                                     start_datetime, end_datetime], device=selected_device).values("date_time")
            raw_data_records = Report.objects.filter(date_time_py__range=[
                                                       start_datetime, end_datetime], device=selected_device).values(selected_channel_db)         
            raw_data_record_array = []
        
            #if records are available in the database for the selected range
            if raw_data_records:
                for record in raw_data_records:
                    current_record_value = float(
                        record.get(selected_channel_db))
                    raw_data_record_array.append(current_record_value)
                df_datetime_column = pd.DataFrame(list(date_time_column))
                dataframe_columns[0] = df_datetime_column
                device_chanel_str = selected_channel + "_" + selected_device
                channel_device_names.append(device_chanel_str)
                df_raw_data_records = pd.DataFrame(list(raw_data_record_array))
                dataframe_columns.append(df_raw_data_records)

    nodata = ['Data Unavailable in the selected range']
    df_nodata = pd.DataFrame(nodata)

    if raw_data_records:
        headers = ['Date & Time']
        for name in channel_device_names:
            headers.append(name)

        itr = 0
        udata = []
        for column in dataframe_columns:
            udata.append(column.iloc[:, 0])
            itr += 1

        raw_final_report = pd.concat(udata, axis=1, keys=headers)

    if not raw_data_records:
        raw_final_report = df_nodata
    
    print("\nRaw Data Report: ")
    print(raw_final_report)

    return raw_final_report

# function to generate History report
def generateHistoricalReport(start_date_time_min, end_date_time_min, device_channel_list):

    global current_time
    global id_array_equipment
    global equip_id 
    global tab_id 
    current_time = str(datetime.datetime.now())
    current_time = "-".join(current_time.split(":"))
    current_time = "-".join(current_time.split("."))

    device_channel_names = []
    minimum_values = []
    maximum_values = []
    avg_values = []
    data_available = False
    nodata = ['Data Unavailable in the selected range']
    df_nodata = pd.DataFrame(nodata)

    #create a new directory
    new_temp_folder = f".\\temp_graphs\\{current_time}\\"
    if not os.path.exists(new_temp_folder):
        os.mkdir(new_temp_folder)
        print("Directory " , new_temp_folder ,  " Created ")
    else:    
            print("Directory " , new_temp_folder ,  " already exists")

    device_channel_dict = defaultdict(list)
    for obj in device_channel_list:
        device_channel_dict[obj.get('Device')].append(obj.get('Channel'))

    for selected_device in device_channel_dict:
        device_channels = device_channel_dict.get(selected_device)
        for selected_channel in device_channels:
            selected_channel_db = channel_name_conversion_dict.get(
                selected_channel)
            start_datetime = strToDatetime(start_date_time_min)
            end_datetime = strToDatetime(end_date_time_min)
            date_time_column = Report.objects.filter(date_time_py__range=[
                                                     start_datetime, end_datetime], device=selected_device).values("date_time_min")
            datetime_list = [i.get("date_time_min")
                             for i in list(date_time_column)]
            # print(datetime_list, 'this is date and time df')
            historical_records = Report.objects.filter(date_time_py__range=[
                                                       start_datetime, end_datetime], device=selected_device).values(selected_channel_db)
            values_list = []
            num_of_records = historical_records.count()
            record_sum = 0
            if not historical_records:
                data_available = False
                historical_final_report = df_nodata

            else: 
                data_available = True
                minimum = float(
                    historical_records.first().get(selected_channel_db))
                maximum = float(
                    historical_records.first().get(selected_channel_db))
                for record in historical_records:
                    current_record_value = float(
                        record.get(selected_channel_db))
                    values_list.append(current_record_value)

                    record_sum += current_record_value

                    if(current_record_value < minimum):
                        minimum = current_record_value

                    if(current_record_value > maximum):
                        maximum = current_record_value

                record_sum = round(record_sum, 2)
                record_avg = round(record_sum / num_of_records, 2)
                # df_final_graph.plot(x='Date & Time', y='Values' ,figsize=(10,5), grid=True)
                # print(len(datetime_list), len(values_list))
                # df_final_graph = pd.DataFrame({"Date & Time" : datetime_list, "Values":values_list})
                # sns.swarmplot(x="Date & Time", y="Values",  data=df_final_graph)
                datetime_df = pd.DataFrame(datetime_list, columns=['Date & Time'])
                values_df = pd.DataFrame(values_list, columns=['Values'])
                headers_v = ['Date & Time', 'Values']
                vdata = [datetime_df['Date & Time'], values_df['Values']]
                final_hist_df = pd.concat(vdata, axis=1, keys=headers_v)
                graph = sns.lineplot(x="Date & Time", y="Values",  data = final_hist_df, color = 'purple')            
                ax = plt.gca()            
                # ax.set_xticklabels(ax.get_xticklabels(), rotation=40, ha="right")
                # my_xticks = ax.get_xticks()
                # plt.xticks([my_xticks[0], my_xticks[-1]], visible=True, rotation="horizontal") 
                ax.xaxis.set_major_locator(plt.MaxNLocator(12))   
                plt.xticks(fontsize=8, rotation=20)
                plt.yticks(fontsize=8)
                # plt.tight_layout()
                plt.title(f'{selected_device}:{selected_channel} \n From {start_datetime} To {end_datetime}', fontsize=8)
                # plt.title(f'From {start_datetime} To {end_datetime}')                
                graph.axhline(minimum,  color='r', label = 'min')
                graph.axhline(maximum,  color='tab:blue', label = 'max')
                graph.axhline(record_avg,  color='g', label = 'avg')
                plt.rcParams.update({'font.size': 8})
                plt.subplots_adjust(top=0.88, bottom=0.20)
                device_chanel_str = selected_channel + "_" + selected_device
                plt.savefig(f'.\\temp_graphs\\{current_time}\\{device_chanel_str}.pdf')
                device_channel_names.append(device_chanel_str)
                plt.cla()
                plt.clf()
                plt.close('all')
                equip_id += 1
                id_array_equipment.append(equip_id)
                minimum_values.append(minimum)
                maximum_values.append(maximum)
                avg_values.append(record_avg)

    if data_available == True:
        df_id = pd.DataFrame(id_array_equipment, columns=['Id'])
        df_device_channels = pd.DataFrame(device_channel_names, columns=['Parameter Name'])
        df_minimum_values = pd.DataFrame(minimum_values, columns=['Minimum'])
        df_maximum_values = pd.DataFrame(maximum_values, columns=['Maximum'])
        df_avg_values = pd.DataFrame(avg_values, columns=['Average'])
        headers = ['Id', 'Parameter Name', 'Minimum', 'Maximum', 'Average']
        udata = [df_id['Id'], df_device_channels['Parameter Name'], df_minimum_values['Minimum'],
                df_maximum_values['Maximum'], df_avg_values['Average']]
        historical_final_report = pd.concat(udata, axis=1, keys=headers)
    else:
        historical_final_report = df_nodata
    print("\nHistorical Report: ")
    print(historical_final_report)
    return historical_final_report

# function to generate Energy Report
def generateEnergyReport(start_date_time_min, end_date_time_min, devices_list):

    calculated_values = []

    # filter based on the user input values
    for selected_device in devices_list:

        start_datetime = strToDatetime(start_date_time_min)
        end_datetime = strToDatetime(end_date_time_min)

        energy_start_record = Report.objects.filter(date_time_py__range=[start_datetime, end_datetime], device=selected_device).values(
            'total_energy', 'import_energy', 'export_energy').first()

        energy_end_record = Report.objects.filter(date_time_py__range=[start_datetime, end_datetime], device=selected_device).values(
            'total_energy', 'import_energy', 'export_energy').last()    

        #if records are available in the database for the selected range
        if energy_start_record:
            # calculate the required values for energy report
            energy_diff = energyDiff(energy_start_record, energy_end_record)
            calculated_values.append(energy_diff)
    
    nodata = ['Data Unavailable in the selected range']
    df_nodata = pd.DataFrame(nodata)
    df_device = pd.DataFrame(devices_list, columns=['Device'])
    df_energy = pd.DataFrame(calculated_values, columns=[
                             'Total Energy Consumption'])
    headers = ['Device', 'Total Energy Consumption']
    udata = [df_device['Device'], df_energy['Total Energy Consumption']]
    energy_final_report = pd.concat(udata, axis=1, keys=headers)
    energy_final_report.index += 1
    energy_final_report.index.name = "Sr. No."

    #if no records in the database for the selected range
    if not energy_start_record:
        print("No records found in this range")
        energy_final_report = df_nodata 
        
    print("\nEnergy Report: ")
    print(energy_final_report)
    return energy_final_report






# datatypes = df1.dtypes
# print(datatypes)


class EnergyListView(ListAPIView):
    queryset = Report.objects.all()
    serializer_class = EnergySerializer


class EnergyDetailView(RetrieveAPIView):
    queryset = Report.objects.all()
    serializer_class = EnergySerializer


class EnergyCreateView(CreateAPIView):
    queryset = Report.objects.all()
    serializer_class = EnergySerializer


class EnergyUpdateView(UpdateAPIView):
    queryset = Report.objects.all()
    serializer_class = EnergySerializer


@permission_classes((AllowAny, ))
class PostReport(APIView):
    def post(self, request, format=None):
        start_date = request.data.get('start_date')  # 2020-08-19
        end_date = request.data.get('end_date')  # 2020-09-19
        start_time = request.data.get('start_time')  # 08:01
        end_time = request.data.get('end_time')  # 08:05
        start_date_time_min = start_date + " " + start_time  # 2020-09-19 08:01
        end_date_time_min = end_date + " " + end_time
        # selected rows in JSON (for energy report)
        selected_rows = request.data.get('selected_rows')
        selected_rows_string = json.dumps(selected_rows)
        selected_rows_list = json.loads(selected_rows_string)
        # selected rows in JSON (for historical and raw report)
        selected_rows_with_channels = request.data.get('selected_rows')
        selected_rows_with_channels_string = json.dumps(
            selected_rows_with_channels)
        device_channel_list = json.loads(selected_rows_with_channels_string)
        report_type = request.data.get('report')
        file_type = "xlsx"
        calculated_values = []

       # ---- Energy Report ----

        energy_final_report = pd.DataFrame()
        if(report_type == "energyReport"):

            devices_list = []
            for selected_row in selected_rows_list:
                devices_list.append(selected_row.get('code'))
            energy_final_report = generateEnergyReport(
                start_date_time_min, end_date_time_min, devices_list)

        # ---- Raw Data Report ----

        raw_final_report = pd.DataFrame()
        if(report_type == "rawData"):
            raw_final_report = generateRawDataReport(
                start_date_time_min, end_date_time_min, device_channel_list)

        # ------ Historical Report -----

        historical_final_report = pd.DataFrame()
        if(report_type == "historyReport"):

            equip_id_array = []
    
            #call the generateHistoricalReport function
            historical_final_report = generateHistoricalReport(
                start_date_time_min, end_date_time_min, device_channel_list)

            device_channel_dict = defaultdict(list)
            for obj in device_channel_list:
                device_channel_dict[obj.get('Device')].append(obj.get('Channel'))
        
            for i in range(len(device_channel_dict)):
                equip_id_array.append(i+1)

            equip_id_df = pd.DataFrame(equip_id_array, columns=['Id'])
            equipments_df = pd.DataFrame(device_channel_dict.keys(), columns=['Equipment'])
            headers = ['Id', 'Equipment']
            udata = [equip_id_df['Id'], equipments_df['Equipment']]
            historical_equipment_table = pd.concat(udata, axis=1, keys=headers)

        # ---- Download -----

        df = pd.DataFrame()

        if(file_type == "xlsx" and report_type == "energyReport"):
            energy_final_report.to_excel('Energy Report.xlsx', index=False)
            df = energy_final_report

        elif(file_type == "xlsx" and report_type == "rawData"):
            raw_final_report.to_csv('Raw Data Report.csv', index=False)
            df = raw_final_report

        elif(file_type == "xlsx" and report_type == "historyReport"):
            # read the excel files as a dataframe
            historical_final_report.to_excel('Historical Report Excel.xlsx')
            historical_equipment_table.to_excel('Historical Report - Equipment Details Excel.xlsx')
            df_equip = historical_equipment_table
            df = historical_final_report

            fig, ax = plt.subplots(figsize=(6, 3))
            ax.set_title(f'Start Date and Time : {start_date_time_min}\n End Date and Time : {end_date_time_min} \n\n Summary Details - Electrical Parameters \n\n Equipment Details')
            fig.tight_layout()
            ax.axis('tight')
            ax.axis('off')
            ccolors = plt.cm.BuPu(np.full(len(df.columns), 0.1))
            the_table = ax.table(cellText=df_equip.values, colLabels=df_equip.columns,
                                 loc='center', colColours=ccolors, rowLoc='center', colLoc='left', cellLoc='left', colWidths=[0.1, 0.8])
            pp = PdfPages("historical_equipments_table.pdf")
            pp.savefig(fig, bbox_inches='tight')
            plt.cla()
            plt.clf()
            plt.close('all') 
            plt.close(fig)
            pp.close()

            # df = pd.DataFrame(np.random.random((10,3)), columns = ("col 1", "col 2", "col 3"))
            fig, ax = plt.subplots(figsize=(6, 3))
            ax.axis('tight')
            ax.axis('off')
            ax.title.set_text("Parameter Details")
            ccolors = plt.cm.BuPu(np.full(len(df.columns), 0.1))
            the_table = ax.table(cellText=df.values, colLabels=df.columns,
                                 loc='center', colColours=ccolors, cellLoc='left', colLoc='left', rowLoc='center', colWidths=[0.05, 0.25, 0.2, 0.2, 0.2])
            pp = PdfPages("historical_data_table.pdf")
            pp.savefig(fig, bbox_inches='tight')
            plt.cla()
            plt.clf()
            plt.close('all') 
            plt.close(fig)
            pp.close()

            global current_time
            TEMP_GRAPHS_FOLDER = ".\\temp_graphs\\" + current_time + "\\"

            listofdirs = os.listdir(TEMP_GRAPHS_FOLDER)

            x = [a for a in os.listdir(
                TEMP_GRAPHS_FOLDER) if a.endswith(".pdf")]

            merger = PdfFileMerger()
            # print(x)

            for pdf in x:
                graphfile_path = ".\\temp_graphs\\{}\\".format(current_time) 
                graphfile_path = graphfile_path + pdf
                merger.append(open(graphfile_path, 'rb'))

            with open("all_graphs.pdf", "wb") as fout:
                merger.write(fout)

            merger.close()

            # append the PDFs - historical_data_table and all_graphs
            output = PdfFileWriter()
            pdfOne = PdfFileReader(open(r'.\historical_data_table.pdf', "rb"))
            pdfOnePages = pdfOne.numPages
            pdfTwo = PdfFileReader(open(r'.\all_graphs.pdf', "rb"))
            pdfTwoPages = pdfTwo.numPages

            for i in range(pdfOnePages):
                output.addPage(pdfOne.getPage(i))
            for i in range(pdfTwoPages):
                output.addPage(pdfTwo.getPage(i))

            outputStream = open(r"historical_report_temp_merged.pdf", "wb")
            output.write(outputStream)
            outputStream.close()

            # append the PDFs - historical_equipments_table and historical_report_temp_merged
            output = PdfFileWriter()
            pdf1 = PdfFileReader(open(r'.\historical_equipments_table.pdf', "rb"))
            pdf1Pages = pdf1.numPages
            pdf2 = PdfFileReader(open(r'.\historical_report_temp_merged.pdf', "rb"))
            pdf2Pages = pdf2.numPages

            for i in range(pdf1Pages):
                output.addPage(pdf1.getPage(i))
            for i in range(pdf2Pages):
                output.addPage(pdf2.getPage(i))

            outputStream = open(r"historical_report_temp_final.pdf", "wb")
            output.write(outputStream)
            outputStream.close()

            # set all the pages to A4
            src = fitz.open(r"historical_report_temp_final.pdf")  # problem PDF
            doc = fitz.open()
            for ipage in src:
                if ipage.rect.width > ipage.rect.height:
                    fmt = fitz.PaperRect("a4-l")  # landscape if input suggests
                else:
                    fmt = fitz.PaperRect("a4")
                page = doc.newPage(width = fmt.width, height = fmt.height)
                page.showPDFpage(page.rect, src, ipage.number)

            doc.save("historical_report_temp.pdf")
            doc.close()
            src.close()


        else:
            f = open('report.html', 'w')
            a = energy_final_report.to_html()
            f.write(a)
            f.close()
            pdfkit.from_file('report.html', 'report.pdf')
        
        #here begins the donwloading part.
        #libraries to be installed- xlsxwriter,apscheduler
        #here the pandas df can be used directly
        
        if(report_type == "energyReport"):
            xlwriter=pd.ExcelWriter('report.xlsx',engine='xlsxwriter')
            df.to_excel(xlwriter, sheet_name='Sheet1',startrow=4)
            xlworkbook = xlwriter.book
            xlworksheet =xlwriter.sheets['Sheet1']
            xlworksheet.set_column('B:B', 15)
            xlworksheet.set_column('C:C', 25)
            xlworksheet.insert_image('A1', '.\\report\\header.PNG', {'x_scale': 0.305, 'y_scale': 0.45})
            xlworkbook.close()
            excel_file=open('.\\report.xlsx','rb').read()
            response = HttpResponse(excel_file, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'attachment; filename=Report.xlsx'
            return response

        elif(report_type == "rawData"):
            excel_file = open('.\\Raw Data Report.csv', 'rb').read()
            response = HttpResponse(
                excel_file, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'attachment; filename=Report.csv'
            return response

        else:
            excel_file = open('.\\historical_report_temp.pdf', 'rb').read()
            response = HttpResponse(
                excel_file, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'attachment; filename=Report.pdf'
            return response


# make_report()

# def home(request):
#     mydict = {
#         "df": df1.to_html()
#     }
#     return render(request, 'input.html', context=mydict)


def report(request):
    calculated_values = []
    if request.method == 'POST':
        start_date = request.POST.get("start_date")
        end_date = request.POST.get("end_date")
        file_type = request.POST.get("file_type")
        devices = request.POST.get("devices")
        # dn -> from request
        # search_values -> from request
        # type of file -> from request
        for name in dn:
            df_test = pd.read_excel(datasheet, name)
            df_test = df_test.iloc[:, [0, 13, 19, 20]].copy()
            df_test['Date'] = pd.to_datetime(
                df_test['Date & Time']).dt.date.astype('string')
            df_test = df_test.iloc[:, [1, 2, 3, 4]].copy()
            column_test = list(df_test.columns)
            df_test['Total'] = df_test[column_test[:-1]].sum(axis=1)
            df_test = df_test.iloc[:, [3, 4]].copy()
            #search_values = ['2020-08-19','2020-09-19']
            search_values = [start_date, end_date]
            df_test = df_test[df_test.Date.str.contains(
                '|'.join(search_values))]
            energy = df_test['Total'][df_test.index[-1]] - \
                df_test['Total'][df_test.index[0]]
            calculated_values.append(energy)
        df_energy = pd.DataFrame(calculated_values, columns=[
                                 'Total Energy Consumption'])
        # at the end create this.
        headers = ['Tag No.', 'Total Energy Consumption']
        udata = [df_device['Device'], df_energy['Total Energy Consumption']]
        final_report = pd.concat(udata, axis=1, keys=headers)
        # print(final_report)
        if(file_type == "csv"):
            final_report.to_csv('report.csv')
            # r=requests.get(final_report,allow_redirects=True)
            # open('report.csv','wb').write(r.content)
        else:
            f = open('report.html', 'w')
            a = final_report.to_html()
            f.write(a)
            f.close()
            pdfkit.from_file('report.html', 'report.pdf')
    return render(request, 'input.html')

# def make_model(request):
#     if request.method == 'POST':
#         report_resource = ReportResource()
#         dataset = Dataset()
#         new_report = request.FILES['myfile']

#         if not new_report.name.endswith('xlsx'):
#             messages.info(request, 'wrong format')
#             return render(request, 'input.html')

#         imported_data = dataset.load(new_report.read(),format='xlsx')
#         df = pd.ExcelFile(new_report)
#         print(df.sheet_names)

#         # print(energy, 'this is energy')
#         #print(imported_data)
#         # for data in imported_data:
#         #         #print(data)
#         #         value = Report(
#         #             data[0],
#         #             data[1],
#         #             data[14],
#         #             data[20],
#         #             data[21]
#         #             )
#         #         value.save()
#         print(df_test)
#     return render(request, 'input.html')


#-------------------------------------------------------------------scheduling-----------------------------------------------------------------------------#
myEnvVals.setVar()

# scheduler
scheduler = BackgroundScheduler()

def get_times(schedule, schedule_num):
    a = datetime.datetime.now()
    days = 0
    if schedule == 'day':
        days = 1
    elif schedule == 'week':
        days = 7
    else:
        days = 30
    days = days*int(schedule_num)
    b = datetime.timedelta(days=days)
    end_datetime = a-b
    end_date = str(end_datetime.date())
    end_time = end_datetime.time()
    end_time = str(end_time.strftime("%H:%M"))

    start_date = str(a.date())
    start_time = a.time()
    start_time = str(start_time.strftime("%H:%M"))
    return start_date, start_time, end_date, end_time


def schedule_mail(mail, scheduler, interval_time, interval_format, start_date_time, job_id):
    hours = int(interval_time)
    print("hours initial",hours)
    if(hours == 0 and interval_format != "daily"):
        hours = 1

    if(interval_format == 'daily'):
        hours = 24
    elif(interval_format == 'weekly'):
        hours = hours*24*7
    elif(interval_format == 'monthly'):
        hours = hours*24*30

    print(hours)

    # change 'minutes = 1' to 'hours = hours'

    scheduler.add_job(mail, 'interval', minutes=3,
                      id=job_id, start_date=start_date_time)
    

    

 

def generate_string():
    N = 7

    res = ''.join(random.choices(string.ascii_uppercase +
                                 string.digits, k=N))
    return res


def send_mail(recipient_list, report_type, report_name):
    EMAIL_ADDRESS = os.environ.get('EMAIL_ADDRESS')
    EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD')
    report = ''
    filename = ''
    subtype = ''
    if report_type == 'rawData':
        report = "Raw Data Report"
        filename = report + ".csv"
        subtype = 'csv'

    elif report_type == 'energyReport':
        report = "Energy Report"
        filename = report + ".xlsx"
        subtype = 'xlsx'

    else:
        report = "Historical Data Report"
        filename = report + ".pdf"
        subtype = 'pdf'

    body = "Find attached " + report

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        if len(recipient_list) == 0:
            return "empty list"
        for recipent in recipient_list:
            msg = EmailMessage()
            msg['Subject'] = report
            msg.set_content(body)
            msg['From'] = EMAIL_ADDRESS
            with open(report_name, 'rb') as f:
                file_data = f.read()
            msg.add_attachment(file_data, maintype='application',
                               subtype=subtype, filename=filename)
            msg['TO'] = recipent['email']
            smtp.send_message(msg)
    print("done")


def next_weekday(d, weekday):
    days_ahead = weekday - d.weekday()
    if days_ahead <= 0:  # Target day already happened this week
        days_ahead += 7
    return d + datetime.timedelta(days_ahead)


def starting_date_time(frequency, date, day, time):
    start_date_time = ''
    if frequency == 'daily':
        hour = time.split(":")[0]
        minute = time.split(":")[1]
        today = str(datetime.date.today())
        year = int(today[0:4])
        month = int(today[5:7])
        day_ = int(today[8:10])

        d1 = datetime.datetime(year=year, month=month,
                               day=day_, hour=int(hour), minute=int(minute))
        d2 = datetime.datetime.now()
        if d1 > d2:
            date_ = str(datetime.date.today())
            start_date_time = date_ + " " + time + ":00"
        else:
            date_ = datetime.datetime.now() + datetime.timedelta(days=1)
            date_ = str(date_.date())
            start_date_time = date_ + " " + time + ":00"

    elif frequency == "weekly":
        today = datetime.date.today()
        date_ = str(next_weekday(today, day))
        start_date_time = date_ + " " + time + ":00"
    elif frequency == "monthly":
        year = int(date[0:4])
        month = int(date[5:7])
        day_ = int(date[8:10])
        date_ = datetime.date(year=year, month=month, day=day_)
        if(date_<datetime.date.today()):
            date_ = datetime.date.today() + datetime.timedelta(days=30)
            date_ = str(date_.date())
        else:
            date_ = str(date_)
        start_date_time = date_ + " " + time + ":00"
    return start_date_time

def set_mail(report_type, start_date_time_min, end_date_time_min, selected_rows_list, device_channel_list, recipient_list):
    energy_final_report = pd.DataFrame()
    filename = ""
    if(report_type == "energyReport"):

        devices_list = []
        for selected_row in selected_rows_list:
            devices_list.append(selected_row.get('code'))
        energy_final_report = generateEnergyReport(
            start_date_time_min, end_date_time_min, devices_list)
        filename = "Energy Report.xlsx"

    # ---- Raw Data Report ----

    raw_final_report = pd.DataFrame()
    if(report_type == "rawData"):
        raw_final_report = generateRawDataReport(
            start_date_time_min, end_date_time_min, device_channel_list)
        filename = "Raw Data Report.csv"

    # ------ Historical Report -----

    historical_final_report = pd.DataFrame()
    if(report_type == "historyReport"):
        historical_final_report = generateHistoricalReport(
            start_date_time_min, end_date_time_min, device_channel_list)
        equip_id_array = []
    
        #call the generateHistoricalReport function
        historical_final_report = generateHistoricalReport(
            start_date_time_min, end_date_time_min, device_channel_list)

        device_channel_dict = defaultdict(list)
        for obj in device_channel_list:
            device_channel_dict[obj.get('Device')].append(obj.get('Channel'))
    
        for i in range(len(device_channel_dict)):
            equip_id_array.append(i+1)

        equip_id_df = pd.DataFrame(equip_id_array, columns=['Id'])
        equipments_df = pd.DataFrame(device_channel_dict.keys(), columns=['Equipment'])
        headers = ['Id', 'Equipment']
        udata = [equip_id_df['Id'], equipments_df['Equipment']]
        historical_equipment_table = pd.concat(udata, axis=1, keys=headers)
        filename = "historical_report_temp.pdf"

    df = pd.DataFrame()

    if(report_type == "energyReport"):
        energy_final_report.to_excel('Energy Report.xlsx')
        df = energy_final_report

    elif(report_type == "rawData"):
        raw_final_report.to_csv('Raw Data Report.csv')
        df = raw_final_report

    elif(report_type == "historyReport"):
        historical_final_report.to_excel('Historical Report Excel.xlsx')
        historical_equipment_table.to_excel('Historical Report - Equipment Details Excel.xlsx')
        df_equip = historical_equipment_table
        df = historical_final_report

        fig, ax = plt.subplots(figsize=(6, 3))
        ax.set_title(f'Start Date and Time : {start_date_time_min}\n End Date and Time : {end_date_time_min} \n\n Summary Details - Electrical Parameters \n\n Equipment Details')
        fig.tight_layout()
        ax.axis('tight')
        ax.axis('off')
        ccolors = plt.cm.BuPu(np.full(len(df.columns), 0.1))
        the_table = ax.table(cellText=df_equip.values, colLabels=df_equip.columns,
                                loc='center', colColours=ccolors, rowLoc='center', colLoc='left', cellLoc='left', colWidths=[0.1, 0.8])
        pp = PdfPages("historical_equipments_table.pdf")
        pp.savefig(fig, bbox_inches='tight')
        plt.cla()
        plt.clf()
        plt.close('all') 
        plt.close(fig)
        pp.close()

        # df = pd.DataFrame(np.random.random((10,3)), columns = ("col 1", "col 2", "col 3"))
        fig, ax = plt.subplots(figsize=(6, 3))
        ax.axis('tight')
        ax.axis('off')
        ax.title.set_text("Parameter Details")
        ccolors = plt.cm.BuPu(np.full(len(df.columns), 0.1))
        the_table = ax.table(cellText=df.values, colLabels=df.columns,
                                loc='center', colColours=ccolors, cellLoc='left', colLoc='left', rowLoc='center', colWidths=[0.05, 0.25, 0.2, 0.2, 0.2])
        pp = PdfPages("historical_data_table.pdf")
        pp.savefig(fig, bbox_inches='tight')
        plt.cla()
        plt.clf()
        plt.close('all') 
        plt.close(fig)
        pp.close()

        TEMP_GRAPHS_FOLDER = r'.\temp_graphs'

        x = [a for a in os.listdir(
            TEMP_GRAPHS_FOLDER) if a.endswith(".pdf")]

        merger = PdfFileMerger()
        # print(x)

        for pdf in x:
            graphfile_path = r'.\\temp_graphs\\' + pdf
            merger.append(open(graphfile_path, 'rb'))

        with open("all_graphs.pdf", "wb") as fout:
            merger.write(fout)

        merger.close()

        # append the PDFs - historical_data_table and all_graphs
        output = PdfFileWriter()
        pdfOne = PdfFileReader(open(r'.\historical_data_table.pdf', "rb"))
        pdfOnePages = pdfOne.numPages
        pdfTwo = PdfFileReader(open(r'.\all_graphs.pdf', "rb"))
        pdfTwoPages = pdfTwo.numPages

        for i in range(pdfOnePages):
            output.addPage(pdfOne.getPage(i))
        for i in range(pdfTwoPages):
            output.addPage(pdfTwo.getPage(i))

        outputStream = open(r"historical_report_temp_merged.pdf", "wb")
        output.write(outputStream)
        outputStream.close()

        # append the PDFs - historical_equipments_table and historical_report_temp_merged
        output = PdfFileWriter()
        pdf1 = PdfFileReader(open(r'.\historical_equipments_table.pdf', "rb"))
        pdf1Pages = pdf1.numPages
        pdf2 = PdfFileReader(open(r'.\historical_report_temp_merged.pdf', "rb"))
        pdf2Pages = pdf2.numPages

        for i in range(pdf1Pages):
            output.addPage(pdf1.getPage(i))
        for i in range(pdf2Pages):
            output.addPage(pdf2.getPage(i))

        outputStream = open(r"historical_report_temp_final.pdf", "wb")
        output.write(outputStream)
        outputStream.close()

        # set all the pages to A4
        src = fitz.open(r"historical_report_temp_final.pdf")  # problem PDF
        doc = fitz.open()
        for ipage in src:
            if ipage.rect.width > ipage.rect.height:
                fmt = fitz.PaperRect("a4-l")  # landscape if input suggests
            else:
                fmt = fitz.PaperRect("a4")
            page = doc.newPage(width = fmt.width, height = fmt.height)
            page.showPDFpage(page.rect, src, ipage.number)

        doc.save("historical_report_temp.pdf")
        doc.close()
        src.close()

    send_mail(recipient_list, report_type, filename)
    pass


# class for scheduling
@permission_classes((AllowAny, ))
class ScheduleReportView(APIView):
    # print("testing patience")

    def post(self, request, format=None):
        global scheduler

        report_type = request.data.get("report")
        frequency_num = request.data.get('frequency_num')
        frequency = request.data.get('frequency')
        schedule = request.data.get('schedule')
        schedule_num = request.data.get('schedule_num')
        start_date, start_time, end_date, end_time = get_times(
            schedule, schedule_num)

        recipient_list = request.data.get('recipient_list')

        recipient_list = json.loads(json.dumps(recipient_list))

        selected_rows = request.data.get('rows_list')
        start_date_time_min = start_date + " " + start_time  # 2020-09-19 08:01
        end_date_time_min = end_date + " " + end_time
        selected_rows_string = json.dumps(selected_rows)
        selected_rows_list = json.loads(selected_rows_string)
        # selected rows in JSON (for historical and raw report)
        selected_rows_with_channels = request.data.get('rows_list')
        selected_rows_with_channels_string = json.dumps(
            selected_rows_with_channels)
        device_channel_list = json.loads(selected_rows_with_channels_string)
        file_type = "xlsx"
        calculated_values = []

        date = request.data.get('date')
        day = request.data.get('day')
        time = request.data.get('time')
        print("in normal schedule")
        print("day", day, "time", time, "date", date)
        date_model = date
        day_model = day
        time_model = time
        day_ = 0
        if day == 'Mon':
            day_ = 0
        elif day == "Tue":
            day_ = 1
        elif day == "Wed":
            day_ = 2
        elif day == "Thu":
            day_ = 3
        elif day == "Fri":
            day_ = 4
        elif day == "Sat":
            day_ = 5
        elif day == "Sun":
            day_ = 6
        else:
            day_ = 0

        start_date_time = starting_date_time(frequency, date, day_, time)

        #-----------------------------------------------------storing in model----------------------------------------------------------------#
        frequency_model = ""

        if frequency == "daily":
            frequency_model = "daily"
        elif frequency == "weekly":
            frequency_model = "every " + \
                str(frequency_num) + " week" + \
                ("s" if int(frequency_num) > 1 else "")
        else:
            frequency_model = "every " + \
                str(frequency_num) + " month" + \
                ("s" if int(frequency_num) > 1 else "")

        duration_model = ""
        if schedule == "day":
            duration_model = "1 day"
        elif schedule == "week":
            duration_model = str(schedule_num) + " week" + \
                ("s" if int(schedule_num) > 1 else "")
        else:
            duration_model = str(schedule_num) + " month" + \
                ("s" if int(schedule_num) > 1 else "")
        id_model = generate_string()
        report_model = ""
        if report_type == "energyReport":
            report_model = "Energy Report"
        elif report_type == "rawData":
            report_model = "Raw Report"
        else:
            report_model = "Historical Data Model"
        scheduling_time_model = datetime.datetime.now()

        recipient_model = json.dumps(recipient_list)
        selected_rows_model = json.dumps(selected_rows_list)


        schedule_dict = {"frequency": frequency_model, "duration": duration_model, "report_type": report_model, "scheduling_time": scheduling_time_model,
                         "id": id_model, "recipient": recipient_model, "selected_rows": selected_rows_model, "day": day_model, "time": time_model, "date": date_model}
        serializer = ScheduleSerializer(data=schedule_dict)

        if serializer.is_valid():
            frequency_model = serializer.data.get("frequency")
            duration_model = serializer.data.get("duration")
            report_model = serializer.data.get("report_type")
            scheduling_time_model = serializer.data.get("scheduling_time")
            id_model = serializer.data.get("id")
            recipient_model = serializer.data.get("recipient")
            selected_rows_model = serializer.data.get("selected_rows")
            day_model = serializer.data.get("day")
            date_model = serializer.data.get("date")
            time_model = serializer.data.get("time")

            schedule = Schedule()
            schedule.frequency = frequency_model
            schedule.duration = duration_model
            schedule.report_type = report_model
            schedule.scheduling_time = scheduling_time_model
            schedule.id = id_model
            schedule.recipient = recipient_model
            schedule.selected_rows = selected_rows_model
            schedule.day = day_model
            schedule.date = date_model
            schedule.time = time_model

            schedule.save()

        
        # replace the hardcoded dates with start_date_time_min and end_date_time_min respectively
        schedule_mail(lambda:set_mail(report_type, "2020-08-19 08:01", "2020-08-19 08:45", selected_rows_list, device_channel_list, recipient_list), scheduler,
                      interval_time=frequency_num, interval_format=frequency, start_date_time=start_date_time, job_id=id_model)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# data_file = r'.\report\excel_reports\raw_sample_data.xlsx'
# # data_file = r'.\report\excel_reports\raw_sample_data_csv.csv'
# datasheet = pd.ExcelFile(data_file)
# dn = datasheet.sheet_names
# df_device = pd.DataFrame(dn, columns =['Device'])

# with open(r'.\report\excel_reports\raw_sample_data_csv.csv') as f:
#     reader = csv.reader(f)
#     for row in reader:
#         _, created = Report.objects.get_or_create(
#             date_time = row[0],
#             device = "EM1",
#             energy = row[14][:-1],
#             import_energy = row[19],
#             export_energy = row[20],
#         )

# making dataframe
# test_df = pd.read_csv(r".\report\excel_reports\raw_sample_data_csv.csv")

# output the dataframe
# print(test_df)

       # calculated_values = []
        # for name in devices_list:
        #     df_test = pd.read_excel(datasheet, name)
        #     df_test = df_test.iloc[: , [0, 13, 19, 20]].copy()
        #     df_test['Date'] = pd.to_datetime(df_test.iloc[:, 0]).dt.date.astype('string')
        #     df_test = df_test.iloc[: , [1,2,3,4]].copy()
        #     column_test = list(df_test.columns)
        #     df_test['Total']= df_test[column_test[:-1]].sum(axis=1)
        #     df_test = df_test.iloc[:, [3,4]].copy()
        #     #search_values = ['2020-08-19','2020-09-19']
        #     search_values = [start_date, end_date]
        #     df_test = df_test[df_test.Date.str.contains('|'.join(search_values))]
        #     energy = df_test['Total'][df_test.index[-1]] - df_test['Total'][df_test.index[0]]
        #     calculated_values.append(energy)
        # df_energy= pd.DataFrame(calculated_values, columns =['Total Energy Consumption'])

        # ###at the end create this.
        # headers = ['Tag No.', 'Total Energy Consumption']
        # udata = [ df_device['Device'], df_energy['Total Energy Consumption']]
        # final_report = pd.concat(udata, axis=1, keys=headers)
        # # print(final_report)
        # if(file_type == "xlsx"):
        #     final_report.to_excel('report.xlsx')
        # else:
        #     f = open('report.html','w')
        #     a = final_report.to_html()
        #     f.write(a)
        #     f.close()
        #     pdfkit.from_file('report.html', 'report.pdf')


@permission_classes((AllowAny, ))
class GetEnergyDevices(APIView):
    def get(self, request, format=None):
        # --- List of Devices ---
        all_devices = Report.objects.all().values('device').distinct()
        all_devices_list = []
        for device in all_devices.iterator():
            all_devices_list.append(device.get("device"))

         # ----- List of Channels -----
        all_channels_list = ['Frequency', 'Voltage Ph1', 'Voltage Ph2', 'Voltage Ph3', 'Voltage Ph1-Ph2', 'Voltage Ph2-Ph3', 'Voltage Ph3-Ph1', 'Current Ph1',
                             'Current Ph2', 'Current Ph3', 'Cuurent Average', 'Active Power', 'Total Energy', 'Power Factor', 'THD Voltage', 'THD Current I1', 'THD Current I2', 'THD Current I3', 'Import Energy', 'Export Energy']

        all_devices_channel = []
        all_devices_channel.append(all_devices_list)
        all_devices_channel.append(all_channels_list)
        return Response({"list": all_devices_channel}, status=status.HTTP_200_OK)


def delete_selected_rows(scheduler, selected_rows):
    print("initial")
    scheduler.print_jobs()
    selected_rows = json.loads(json.dumps(selected_rows))
    print("deletion ke rows",selected_rows)
    for row in selected_rows:
        row_id = row['id']
        scheduler.remove_job(row_id)
        Schedule.objects.filter(id=row_id).delete()
    print("final")
    scheduler.print_jobs()


@permission_classes((AllowAny, ))
class ScheduleView(APIView):
    def get(self, request, format=None):
        schedules = Schedule.objects.all()
        arr = []
        for i in range(len(schedules)):
            schedule_dict = {"id": None, "reportType": None,
                             "schedulingDate": None, "frequency": None, "duration": None}
            data = ScheduleSerializer(schedules[i]).data
            schedule_dict["reportType"] = data["report_type"]
            schedule_dict["frequency"] = data["frequency"]
            schedule_dict["duration"] = data["duration"]
            schedule_dict["schedulingDate"] = data["scheduling_time"]
            schedule_dict["id"] = data["id"]

            jsonDec = json.decoder.JSONDecoder()
            recipient = jsonDec.decode(data['recipient'])
            selected_rows = jsonDec.decode(data['selected_rows'])
            
            schedule_dict['recipient'] = recipient
            schedule_dict['selected_rows'] = selected_rows
            schedule_dict['day'] = data['day']
            schedule_dict['date'] = data['date']
            schedule_dict['time'] = data['time']

            arr.append(schedule_dict)
        return Response({"list": arr}, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        global scheduler
        selected_rows = request.data.get('selected_rows')
       
        delete_selected_rows(scheduler, selected_rows)
        

        return Response({"status": "deleted"}, status=status.HTTP_200_OK)


# -------------------------------------------------------start scheduler-------------------------------------------------------------------------#
def set_schedules(scheduler):
    schedules = Schedule.objects.all()
    for i in range(len(schedules)):
        for jobs in scheduler.get_jobs():
            id = schedules[i].data['id']
            print("job id",jobs.id)
            if(jobs.id == id):
                scheduler.remove_job(id)
    for i in range(len(schedules)):
        data = ScheduleSerializer(schedules[i]).data

        pretty_report_type = data["report_type"]
        report_type =''
        if 'Energy' in pretty_report_type:
            report_type = 'energyReport'
        elif 'Raw' in pretty_report_type:
            report_type = 'rawData'
        elif 'Historical' in pretty_report_type:
            report_type = 'historyReport'
        
        id_model = data["id"]

        pretty_freq = data["frequency"]
        frequency=''
        frequency_num = 0
        if pretty_freq == 'daily':
            frequency= 'daily'
            frequency_num = 1
        elif 'week' in pretty_freq:
            frequency= 'weekly'
            frequency_num = pretty_freq.split(' ')[1]
        elif 'month' in pretty_freq:
            frequency= 'monthly'
            frequency_num = pretty_freq.split(' ')[1]
        frequency_num = int(frequency_num)

        pretty_scheulde = data["duration"]
        schedule = ''
        schedule_num = 0
        if 'day' in pretty_scheulde:
            schedule= 'day'
            schedule_num = 1
        elif 'week' in pretty_scheulde:
            schedule= 'week'
            schedule_num = pretty_scheulde.split(' ')[0]
        elif 'month' in pretty_scheulde:
            schedule= 'month'
            schedule_num = pretty_scheulde.split(' ')[0]
        schedule_num = int(schedule_num)

        start_date, start_time, end_date, end_time = get_times(
        schedule, schedule_num)
        start_date_time_min = start_date + " " + start_time  # 2020-09-19 08:01
        end_date_time_min = end_date + " " + end_time


        day = data['day']
        date = data['date']
        time = data['time'][:5]

        day_ = 0
        if day == 'Mon':
            day_ = 0
        elif day == "Tue":
            day_ = 1
        elif day == "Wed":
            day_ = 2
        elif day == "Thu":
            day_ = 3
        elif day == "Fri":
            day_ = 4
        elif day == "Sat":
            day_ = 5
        elif day == "Sun":
            day_ = 6
        else:
            day_ = 0
        print("report type",report_type,"frequency",frequency,"day", day_, "date", date, "time", time)

        start_date_time = starting_date_time(frequency, date, day_, time)
        print("start date time",start_date_time)


 

        jsonDec = json.decoder.JSONDecoder()
        recipient = jsonDec.decode(data['recipient'])
        selected_rows = jsonDec.decode(data['selected_rows'])

        # replace the hardcoded dates with start_date_time_min and end_date_time_min respectively
        schedule_mail(lambda: set_mail(report_type, "2020-08-19 08:01", "2020-08-19 08:45", selected_rows, selected_rows, recipient), scheduler,
                      interval_time=frequency_num, interval_format=frequency, start_date_time=start_date_time, job_id=id_model)
        scheduler.print_jobs()
        print("scheduled initial reports")
    
class StartScheduler(APIView):
    def get(self, request, format=None):
        global scheduler
        if scheduler.running:
            pass
        else:
            scheduler.start()
            set_schedules(scheduler)
            print("scheduler has started xoxo")
        return Response({"status": "started"}, status=status.HTTP_200_OK)

    
