FROM python:3.8

ENV DEBUG False

ENV TZ Asia/Kolkata

ENV POSTGRES_DB=postgres \
    POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=postgres \
    DB_HOST=postgres

WORKDIR /code

COPY . /code

EXPOSE 8000

RUN pip3 install gunicorn pathlib
RUN pip3 install -U pip setuptools
RUN pip3 install --no-cache-dir -r /code/requirements/local.txt
RUN pip3 install MarkupSafe==2.0.1
RUN pip3 install PyMuPDF==1.16.14

RUN pip3 install psycopg2 pandas flask flask_cors schedule

#RUN python3 manage.py makemigrations

#RUN python3 manage.py migrate
#RUN python3 manage.py migrate --run-syncdb

RUN chmod +x run.sh
ENTRYPOINT sh ./run.sh
#CMD tail -f /dev/null
#CMD while true; do foo; sleep 2; done

#RUN python3 manage.py createsuperuser
#RUN nohup python3 manage.py runserver &
#RUN gunicorn -c config/gunicorn/dev.py
#ENTRYPOINT gunicorn -c config/gunicorn/prod.py

#RUN python3 Alarm/Alarm_graph.py
#RUN python3 Alarm/Alarm_history.py
#RUN python3 Alarm/Alarm_resolution.py
#CMD ["python3", "Alarm/Alarm_graph.py"]
#CMD ["python3", "Alarm/Alarm_history.py"]
#CMD ["python3", "Alarm/Alarm_resolution.py"]
