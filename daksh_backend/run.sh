python3 manage.py makemigrations;
python3 manage.py migrate --run-syncdb;
nohup python3 manage.py runserver 0.0.0.0:8000 &
#gunicorn config.wsgi;
#gunicorn -c /code/config/gunicorn/dev.py;
#gunicorn -c config/settings/development.py;
#gunicorn --bind 0.0.0.0:8000 config.wsgi:application

python3 /code/Alarm/Alarm_history.py;
python3 /code/Alarm/Alarm_graph.py;
python3 /code/Alarm/Alarm_resolution.py;

while true; do sleep 2; done;
