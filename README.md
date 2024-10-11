# The Expenses App

This app allows the user to ingest csv data from online banking sites. Only supporting Discover and Educator's Credit Union currently. Inspiration from hours of fiddling with google sheets to track my expenses from multiple sources. 

## Installation

### Mobile (React Native)
You should be able to install npm packages using yarn install.

```bash
$ yarn
```

Then run npx expo. You can use flags (--localhost --ios) to run a simulator on your Macbook.

```bash
$ npx expo start -c
```

### Backend API
You want to build a .env file in the /api folder. 

```
FLASK_APP=app.py
FLASK_ENV=development
DB_URI=mysql+pymysql://root:pwd@db:3306/budget
PYTHONUNBUFFERED=1
SECRET_KEY=<generate a hash>
DB_USER=root
DB_PWD=pwd
DB_PORT=3306
DB_HOST=db
```
You can start the docker containers with docker compose. 


```bash
$ docker-compose up -d
```

You can stop the docker containers like so.

```bash
$ docker-compose down
```


##y
## Integration Tests With Pytest
- You must run test-db docker container inside the docker-compose.test.yml file
- You can run integration tests with following command inside integration folder
```commandline
pytest --dburl=mysql+pymysql://root:pwd@127.0.0.1:32001 --dbname=budget -v --tb=no --disable-warnings
```

## Usage

In the home page, use the login icon to either login or create a user.

Afterward, go back to the homepage and upload your csv files from educators or discover.

The Uncategorized Items page contains transactions that were not automatically categorized. Click on the category button to add a category for the selected transaction

Use the Find Month page to look at a specific month's data. 