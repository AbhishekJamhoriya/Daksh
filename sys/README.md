Group					: manik group  
Users					: manik, avl  
Server IP				: `10.6.0.71`  
Global IP				: `203.110.86.71:1883`  
API port				: `9101`  

# ENVIRONMENT	
mqtt					: paho-mqtt  
: mosquitto - 1.6.10  
proxy					: haproxy			# replace with nginx?  
synthetic data				: em1.py, em100.py  
mqtt to postgress script 		: postgress_comm.py 

# NATIVE CONFIG
influxd bind address 			: `127.0.0.1:8088`  
influx http bind 			: `8086`  
kapacitor default 			: `9092`  
telegraf input from mqtt		: `1883`  
telegraf config 			: `/etc/telegraf/telegraf.conf`  
influxdb config				: `/etc/influxdb/influxdb.conf`  
start telegraf 				: `telegraf --config path_to_/telegraf.conf`  
start influx/kapacitor/pgsql		: `sudo systemctl start _____` `influxdb` or `kapacitor` or `postgresql`  
stop influx/kapacitor/pgsql		: `sudo systemctl stop _____` `influxdb` or `kapacitor` or `postgresql`  

show running services 			: `systemctl --type=service`  
show running service (on port)		: `systemctl --type=service | grep xxx`  
list ports				: `sudo lsof -i -P -n | grep LISTEN`  


current influx table : `kamal`  
previous table : `kamal_live3`  
table set by mqtt 


## Influx - database
run influx shell : `influx`

```
show databases  
use kamal  
show tag keys on kamal  
show series from db_name  
select * from db_name  
select * from db_name where tag = xxx
```  

access influx in container : `influx`
dump					: `influx -database 'kamal' -execute 'SELECT * FROM kamal' -format csv > test.csv`  
 
## Kapacitor 
```
kapacitor define cpu_alert -tick cpu_alert.tick  
kapacitor enable cpu_alert  
kapacitor list tasks  
kapacitor show cpu_alert  
kapacitor disable cpu_alert  
sudo tail -f -n 128 /var/log/kapacitor/kapacitor.log  
```

## Postgres  
enter postgres user			: `sudo su - postgres`  
enter psql				: `psql`  
: `sudo -u postgres psql`  

```
CREATE ROLE role;  
CREATE DATABASE db; 
GRANT ALL PRIVILEGES ON DATABASE db TO role;  
```
`vim /var/lib/pgsql/data/postgresql.conf`  
 
list databases				: `\l`  
connect to db				: `\c`  
list relations				: `\d`  
enter psql				: `\q`  
dump					: `\copy (SELECT * FROM iot_device_devicereading) to '~/table.csv' with csv`  
 
container				: `postgres`  
user					: `postgres`  
password				: `root`  
database				: `kamal_live1`  
table					: `json_table`  

container				: `postgres_daksh_api`  
user					: `avl`  
database				: `daksh_api_db`  
table					: `iot_device_devicereading`  
~					: `/var/lib/postgresql`  


# DOCKER SETUP 
list all docker images			: `docker image ls`  
show docker running images 		: `docker ps`  
run bash in docker image		: `docker exec -it container_id bash`  
stop container				: `docker stop container`  
from docker to host			: `127.0.0.1`  
 
copy file from container		: `docker cp container:source destination`  
copy file to container			: `docker cp source container:destination`  
 
%dockerised influxdb (default storage)	: `sudo docker run -dp 8086:8086 -v influxdb:/var/lib/influxdb influxdb:latest`  
%dockerised influxdb			: `docker run -p 8086:8086 -v $PWD/influxdb.conf:/etc/influxdb/influxdb.conf:ro -v /DATA/AVL_DATA:/var/lib/influxdb influxdb:1.8`  
->			: `docker run -p 8086:8086 --network="host" -v /DATA/AVL_DATA/influx:/var/lib/influxdb influxdb:1.8`  
 
dockerised telegraf			: `docker run --network="host" -v ~/docker_telegraf.conf:/etc/telegraf/telegraf.conf:ro telegraf`  
 
dockerised mosquitto			: `sudo docker run -p 1883:1883 -v /home/manik/configs/mosquitto.conf:/etc/mosquitto/mosquitto.conf:ro eclipse-mosquitto:1.6`  
 
create dockerised pgsql			: `docker run --network="host" --name avl-postgres -e POSTGRES_PASSWORD=Password -d postgres`  
->			: `sudo docker run --name postgres -e POSTGRES_PASSWORD=root -d postgres` 
 
->			: `docker run --name postgres -e POSTGRES_PASSWORD=root -p=5432:5432 -d postgres`  
run dockerised pgsql			: `docker run --network="host" -e POSTGRES_PASSWORD=Password -d postgres`  
 
## DOCKER-COMPOSE	- handle multiple dockers  
start					: `sudo docker-compose up --build`  
stop					: `sudo docker-compose down`  
config					: `docker-compose.yml`  
kill all active containers		: `docker container rm $(docker ps -a -q)`  
stats					: `docker stats`  

## API  
Puts data into postgres			: `daksh_api_framework/iot_device/management/commands/postges_data_ingestion.py`  
Reads from postgres			: `daksh_api_framework/iot_device/views.py`  
 
api/daksh_api_framework/		: `API location`  
In .profile add ser env			: `export DAKSH_API_FRAMEWORK_ENV=dev`  
`docker-compose build`  
 
Docker/postgresdb  
`docker-compose build`  
`docker-compose up postgres_daksh_api`	% There will be error  
`docker network create --gateway 172.16.1.1 --subnet 172.16.1.0/24 avl-docker`  
`docker-compose up postgres_daksh_api`	% There will be error  
`docker volume create --name=postgres_daksh_api_volume`  
`docker-compose up postgres_daksh_api`  
`docker-compose down`  
 
`docker-compose up daksh_api_init`	% run once only  
 
RUN					: `docker-compose up daksh_api_dev`  
 
Check if mosquitto service is running  
If yes					: `docker-compose up daksh_api_mqtt_listener`  
 
psql from bash				: `psql -U avl daksh_api_db`  
Delete postgres volume			: `docker volume rm postgres_daksh_api_volume`  
 
## WEBSOCKET
Location : `/home/manik/DakshV2_NIPL/sys/setups/websocket/`
NIPL datagen : `nipl_daksh_v2_web_server`
AVL 1k datagen finalized setup : `avl_daksh_v2_web_server_1k`
InfluxDB : default config
Telegraf config : `conf/telegraf.conf`
Websocket script : `app/main.py`
Websocket function : `@app.websocket("/ws/v4/live_data")` `async def websocket_endpoint_live_data_v4`

 
## DISTRIBUTED 
add worker to swarm			: `docker swarm join --token SWMTKN-1-5526h6xuq5rqyji4p3p8gggyakr4paltvtps4ud4satlhhoxhn-bl326a3tfl40rxtky5245p6j9 10.6.0.26:2377`  
create overlay				: `docker network create -d overlay --attachable my-attachable-overlay`  
network					: `94q7jh9xhq848ou8zubdeale9`  
delete network 				: `docker network rm my-network`   

# Resources 
`htop`  
`top`					- `f` for columns, `p` is swap  
`iostat -x`  
