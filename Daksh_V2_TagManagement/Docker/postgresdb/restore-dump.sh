#!/bin/sh

echo "Waiting for container to startup and initialize db. Sleeping for 7 secs..."
sleep 7

#Read the local file and restore it line by line to the new DB
echo "Starting DB Restore"
cat /root/restore.sql | PGPASSWORD=${DAKSH_V2_TAG_MANAGEMENT_POSTGRES_PASSWORD} psql -U ${DAKSH_V2_TAG_MANAGEMENT_POSTGRES_USER} -d ${DAKSH_V2_TAG_MANAGEMENT_POSTGRES_DB} -p 5432 -h ${DAKSH_V2_TAG_MANAGEMENT_POSTGRES_IP}

echo "Done restoring commands to Postgres. Sleeping for 7 seconds to let any background commands finish before we close it down."
sleep 7
