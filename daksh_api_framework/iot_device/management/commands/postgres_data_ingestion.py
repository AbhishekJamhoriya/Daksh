import logging
import json
import pytz
import paho.mqtt.client as mqtt
from datetime import datetime
from django.utils import timezone
from django.core.management import BaseCommand
from iot_device.utils import formatted_now_time
from iot_device.models import Device, DeviceReading


logger = logging.getLogger('django')


def iot_device_data_callback(message):
    try:
        msg = message.decode('utf-8')
    except (UnicodeDecodeError, AttributeError):
        msg = message
    try:
        msg_dict = json.loads(msg)
    except ValueError:
        logger.error("{} | Failed to decode the message - {}".format(formatted_now_time(), msg))
        msg_dict = {}

    if isinstance(msg_dict, dict):
        device_id = msg_dict.pop('ID', None)
        timestamp = msg_dict.pop('timestamp', None)
        if device_id is not None:
            try:
                if timestamp is not None:
                    naive_datetime = datetime.fromtimestamp(float(timestamp)/1000)
                    aware_datetime = pytz.utc.localize(naive_datetime)
                else:
                    aware_datetime = timezone.now()
                device, created = Device.objects.get_or_create(device_id=device_id,
                                                               defaults={"name": "D{}".format(device_id)})
                DeviceReading.objects.update_or_create(device=device, time=aware_datetime, defaults={"data": msg_dict})
                # DeviceReading.objects.create(device=device, time=timezone.now(), data=msg_dict)
                logger.info("{} | Data ingested successfully\n".format(formatted_now_time()))
            except Exception as e:
                logger.error("{} | Failed to ingest data - {}\n".format(formatted_now_time(), e))
        else:
            logger.info("{} | Ignoring message - {} as device ID is missing".format(formatted_now_time(), msg_dict))
    else:
        logger.info("{} | Ignoring message - {} due to invalid format".format(formatted_now_time(), msg_dict))


class Command(BaseCommand):
    def handle(self, *args, **options):
        client = mqtt.Client(client_id="Daksh_API_MQTT_Listener")
        MQTTHandler().attach_callbacks(client)
        client.loop_forever()


class MQTTHandler:
    def __init__(self):
        self.mqtt_topics_callback_dict = {"#": iot_device_data_callback}

    # The callback for when the client receives a CONNACK response from the server.
    def on_connect(self, client, userdata, flags, rc):
        logger.info("Connected with result code {}".format(rc))
        # Subscribing in on_connect() means that if we lose the connection and reconnect then subscriptions will be
        # renewed.
        for topic in self.mqtt_topics_callback_dict:
            client.subscribe(topic, qos=1)

    def on_subscribe(self, client, userdata, mid, granted_qos):
        logger.info("Subscribed: {} {}".format(mid, granted_qos))

    # The callback for when a PUBLISH message is received from the server.
    def on_message(self, client, userdata, msg):
        logger.info(msg.topic+" "+str(msg.payload))
        try:
            int(msg.topic)
        except ValueError:
            logger.info("Ignoring message on topic - {}\n".format(msg.topic))
        else:
            self.mqtt_topics_callback_dict["#"](msg.payload)
        # try:
        #     self.mqtt_topics_callback_dict[msg.topic](msg.payload)
        # except KeyError:
        #     actual_topic = msg.topic
        #     topic_with_wildcard = actual_topic.replace(actual_topic.split("/")[-1], "#")
        #     self.mqtt_topics_callback_dict[topic_with_wildcard](msg.payload)

    def attach_callbacks(self, client):
        client.on_subscribe = self.on_subscribe
        client.on_message = self.on_message
        client.on_connect = self.on_connect
        logger.info("{} | Connecting to broker 203.110.86.71 at port 1883...".format(formatted_now_time()))
        # client.username_pw_set(username=settings.MQTT_BROKER_USERNAME, password=settings.MQTT_BROKER_PASSWORD)
        client.connect(host="203.110.86.71", port=1883, keepalive=60)
        logger.info("{} | Connected to broker 203.110.86.71 at port 1883".format(formatted_now_time()))
