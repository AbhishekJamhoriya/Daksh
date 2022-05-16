cd daksh_backend
python -m venv env
env\scripts\activate
python -m pip install -r requirements/local.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

cd ..

cd daksh_backend/Alarm
pip install psycopg2 pandas flask flask_cors schedule
python Alarm_graph.py
python Alarm_history.py
python Alarm_resolution.py

cd ../..

cd frontend
npm install -g serve
