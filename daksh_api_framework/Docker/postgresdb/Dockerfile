FROM postgres:14.1

ENV POSTGRES_DB=daksh_api_db \
    POSTGRES_USER=avl \
    POSTGRES_PASSWORD=avl_postgres123!@# \
    PGDATA=/var/lib/postgresql/data/pgdata

#Postgres Configuration
ADD commands/ /docker-entrypoint-initdb.d/

ENTRYPOINT bash /usr/local/bin/docker-entrypoint.sh postgres

EXPOSE 5432
