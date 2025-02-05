# Adds dummy sensors to the database.
# Usage-
#   After doing makemigrations, use the following command to prepare an empty migration file.
#   python manage.py makemigrations --empty sensor
#   A new file will be created- sensors/0002_auto_xxxxxxxx_xxxx.py
#   Copy the below code into that file.
#   Execute- python manage.py migrate

# Generated by Django 2.2 on 2021-02-18 10:19

from django.db import migrations


class Migration(migrations.Migration):
    def addDummySensors(apps, schema_editor):
        sensor = apps.get_model('sensor', 'Sensor')

        dummy1 = sensor()
        dummy1.id = 1
        dummy1.sensor_name = "dummy1"
        dummy1.save()

        dummy2 = sensor()
        dummy2.id = 2
        dummy2.sensor_name = "dummy2"
        dummy2.save()

        dummy3 = sensor()
        dummy3.id = 3
        dummy3.sensor_name = "dummy3"
        dummy3.save()

        dummy1_1 = sensor()
        dummy1_1.id = 4
        dummy1_1.sensor_name = "chartjs"
        dummy1_1.parent_id = 1
        dummy1_1.depth = 1
        dummy1_1.content_url = "https://www.chartjs.org/"
        dummy1_1.save()

        dummy1_2 = sensor()
        dummy1_2.id = 5
        dummy1_2.sensor_name = "highcharts"
        dummy1_2.parent_id = 1
        dummy1_2.depth = 1
        dummy1_2.content_url = "https://www.highcharts.com/"
        dummy1_2.save()

        dummy2_1 = sensor()
        dummy2_1.id = 6
        dummy2_1.sensor_name = "dgl"
        dummy2_1.parent_id = 2
        dummy2_1.depth = 1
        dummy2_1.content_url = "https://www.dgl.ai/"
        dummy2_1.save()

        dummy2_2 = sensor()
        dummy2_2.id = 7
        dummy2_2.sensor_name = "google"
        dummy2_2.parent_id = 2
        dummy2_2.depth = 1
        dummy2_2.content_url = "https://developers.google.com/chart"
        dummy2_2.save()

        dummy3_1 = sensor()
        dummy3_1.id = 8
        dummy3_1.sensor_name = "apache"
        dummy3_1.parent_id = 3
        dummy3_1.depth = 1
        dummy3_1.content_url = "https://spark.apache.org/graphx/"
        dummy3_1.save()

        dummy3_2 = sensor()
        dummy3_2.id = 9
        dummy3_2.sensor_name = "boost"
        dummy3_2.parent_id = 3
        dummy3_2.depth = 1
        dummy3_2.content_url = "https://www.boost.org/doc/libs/1_77_0/libs/graph/doc/index.html"
        dummy3_2.save()

    dependencies = [
        ('sensor', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(addDummySensors),
    ]
