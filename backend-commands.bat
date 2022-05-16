cd daksh_backend
python -m venv env
env\scripts\activate
python -m pip install -r requirements/local.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
