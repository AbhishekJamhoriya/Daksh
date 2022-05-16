## Backend

-  Python Version - 3.8.10 

#### Running in local:

1. **Use cmd or powershell**

2. **Create a python virtual environment in the** `daksh_backend` **directory**
  - `virtualenv env || python3 -m venv env` on linux 
  - or `virtualenv env || python -m venv env` on windows

3. **Activate the virtual environment**
  - `env/scripts/activate.bat || source env/bin/activate` on linux
  - or `env\scripts\activate.bat || env\scripts\activate` on windows

4. **Install the dependencies** (uses sqlite DB in local and PostgreSQL in production)
  - `pip install -r requirements/local.txt`
  - or `python -m pip install -r requirements/local.txt`

5. `python manage.py makemigrations`
- In case of any errors: try deleting the `db.sqlite3` file and run the command again

6. [**Optional:** only required to add dummy data to DB] Create a custom migration in sensors
  `python manage.py makemigrations sensor --empty`
  This will create a new file in `sensor\migrations\` by the name `0002_auto_...py`
  Copy the contents of `sensor\custom_migrations\addDummySensors.py` into this new file.

7. `python manage.py migrate`
- In case of any errors: try running the following command `python manage.py migrate --run-syncdb` instead

8. `python manage.py createsuperuser`

9. `python manage.py runserver 0.0.0.0:8000` **to start server.** 

The backend is now running in http://localhost:8000
Default username: `root`, password : `1234`

###  Alarm Backend

1. Install the Postgrsql set the password= postgres (default)
1. In `daksh_backend/Alarm`
2. Run `pip install psycopg2 pandas flask flask_cors schedule` use cmd/powershell 
3. Then run  
a. `python Alarm_graph.py`  
b. `python Alarm_history.py`  
c. `python Alarm_resolution.py`  

## Frontend

1. Install node.js
2. **In the `daksh_frontend`, run - `npm install`**
3. Enter your backend url in actions/backendUrl.js or add an environment variable named REACT_APP_DEV_URL
4. **Run the frontend - `npm start` or `yarn start`**. If error run `npm install react-scripts --save`. If still error, manually install package.

http://localhost:3000/login  
Default username: `root`, password : `1234`

### Frontend Production
Build : `npm run build`

# Serving instructions
1. In `daksh_frontend/src/actions/backendUrl.js` update the `backendUrl` to the IP of the actual backend server
2. In `daksh_frontend` run `npm run build`
3. Copy the `build` folder to `serve/frontend`
4. _Only needed after code changes_: Replace only the corresponding files of `serve/backend` with those in `daksh_backend`. Do **not** copy anything else, especially `env`, `pychache` and `temp`. 
5. Serve the entire serve folder. Use the Setup and Start files to start using GUI.

**Manual start**
1. On the client machine run `docker-compose up --build -d` for the first run. Incase of error try running again.
2. For subsequent runs, `docker-compose up -d`.
3. `docker exec -it daksh_backend python manage.py createsuperuser`
4. `docker-compose down` to stop the service.

**Note -**
1. `docker container rm -f $(docker ps -a -q)` to force terminate all running containers.
2. `docker rmi $(docker images -a -q)` to clean all the built images
3. If error in frontend persists, try adding `RUN npm install redux-devtools-extension` as the second last line in the Dockerfile_frontend
4. If frontend page doesn't load, clear cookies and data

# Logging
1. `docker logs daksh_backend` for backend container
2. `docker exec daksh_backend cat nohup.out` for backend logs
