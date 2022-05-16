FROM ubuntu:20.04

ARG GIT_USERNAME
ARG GIT_PASSWORD

ENV DEBIAN_FRONTEND=noninteractive \
    DJANGO_SETTINGS_MODULE=daksh_api_framework.settings \
    DJANGO_DEBUG=True \
    DAKSH_API_FRAMEWORK_SU_EMAIL=su@example.com \
    DAKSH_API_FRAMEWORK_SU_PASS=youmustalwayschangeme

RUN apt-get update && \
    apt-get dist-upgrade --yes && \
	apt-get install -y libpng-dev libjpeg8-dev libfreetype6-dev python3-dev python3-pip libssl-dev libcurl4-openssl-dev && \
	apt-get install -y git vim nano iputils-ping net-tools && \
	pip3 install --no-cache-dir --upgrade pyinotify && \
	apt-get autoremove -y && apt-get clean -y && \
	pip3 install --upgrade pip && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt /root/src/daksh_api_framework/requirements.txt

RUN pip3 install --no-cache-dir --trusted-host pypi.python.org -r /root/src/daksh_api_framework/requirements.txt

COPY ./Docker/analytics/jupyter_notebook_config.py /root/.jupyter/jupyter_notebook_config.py

COPY . /root/src/daksh_api_framework/

RUN export

#ENTRYPOINT /bin/bash

EXPOSE 5555 8070 8071 8080 8888 9101
