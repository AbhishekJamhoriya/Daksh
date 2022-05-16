#!/bin/bash
#Run the command as root as we need to shift backup to /var/lib/backup and guaranteed access to containers
cd "$(dirname "$0")" #Change to current directory as working directory

#Set the backup file name
BackupName=dump_$1_`date +%d-%m-%Y"_"%H_%M_%S`.sql

#Backup to specified file
docker exec -t $1 pg_dumpall -c -U postgres > $BackupName

#Compress the backup using LZMA2
tar -Jcvf $BackupName.tar.xz $BackupName

#Remove original SQL Dump
rm $BackupName

#Move the file to target destination
mv $BackupName.tar.xz /var/lib/backup/