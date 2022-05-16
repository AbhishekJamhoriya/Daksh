import paho.mqtt.publish as publish
import time
import threading
from random import randrange
import json


def generate_random_data(device_id):
    rand_data = {
        "ID": device_id,
        "N1": float(randrange(50, 52)),
        "N2": float(randrange(200, 250)),
        "N3": float(randrange(200, 250)),
        "N4": float(randrange(200, 250)),
        "N5": float(randrange(400, 450)),
        "N6": float(randrange(400, 450)),
        "N7": float(randrange(400, 450)),
        "N8": float(randrange(60, 100)),
        "N9": float(randrange(60, 100)),
        "N10": float(randrange(60, 100)),
        "N11": float(randrange(60, 100)),
        "N12": float(randrange(60, 100)),
        "N13": float(randrange(15000, 15500)),
        "N14": float(randrange(0, 10)),
        "N15": float(randrange(0, 10)),
        "N16": float(randrange(0, 10)),
        "N17": float(randrange(0, 10)),
        "N18": float(randrange(0, 10)),
        "N19": float(randrange(15000, 15500)),
        "N20": float(randrange(0, 10)),
    }
    return rand_data


def publish_data(device_id):
    while True:
        data = generate_random_data(device_id)
        publish.single(device_id, json.dumps(data), hostname="203.110.86.71", port=1883, qos=1)
        print(json.dumps(data))
        print("----------------------------------------------------------------------------------")
        time.sleep(10)


if __name__ == "__main__":
    device_ids = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010"]
    for device_id in device_ids:
        t1 = threading.Thread(target=publish_data, kwargs={"device_id": device_id})
        t1.start()
