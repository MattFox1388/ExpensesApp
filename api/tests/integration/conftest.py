from urllib.parse import urlparse

import mysql.connector
import pytest
import argparse


from alcem import db
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.exc import OperationalError as SQLAlchemyOperationalError

from app import create_app
from shared.sqlite_create import initialize_db

parser = argparse.ArgumentParser()

def connect_to_mysql_with_uri(uri):
    parsed = urlparse(uri)

    # Extract connection details from the URI
    user = parsed.username
    password = parsed.password
    host = parsed.hostname
    port = parsed.port if parsed.port else 3306
    database = parsed.path[1:]  # Remove leading slash

    print(f"user: {user}, pwd: {password}, host: {host}, port: {port}, db: {database}")
    # Create the connection
    return  {
        "user":user,
        "password" : password,
        "host" : host,
        "port" : port,
    }



def pytest_addoption(parser):
    parser.addoption(
        "--dburl",
        action="store",
        default="sqlite:///:memory:",
        help="Database URL to use for tests"
    )

    parser.addoption(
        "--dbname",
        action="store",
        default="/budget",
        help="Database name"
    )

@pytest.fixture(scope="session")
def db_url(request):
    return request.config.getoption("--dburl")

@pytest.fixture(scope="session")
def db_name(request):
    return request.config.getoption("--dbname")

@pytest.hookimpl(tryfirst=True)
def pytest_sessionstart(session):
    db_url = session.config.getoption("--dburl")
    try:
        # Attempt to create an engine and connect to the database.
        engine = create_engine(
            db_url,
            poolclass=StaticPool,
        )
        connection = engine.connect()
        connection.close()  # Close the connection right after a successful connect.
        print("Using Database URL:", db_url)
        print("Database connection successful.....")
    except SQLAlchemyOperationalError as e:
        print(f"Failed to connect to the database at {db_url}: {e}")
        pytest.exit(
            "Stopping tests because database connection could not be established."
        )

@pytest.fixture(scope="session")
def app(db_url, db_name):
    print(f"url: {db_url}, name: {db_name}")
    db_conn_config = connect_to_mysql_with_uri(db_url)
    db_conn = mysql.connector.connect(**db_conn_config)
    initialize_db(db_conn)
    db_conn.close()

    test_config = {
        "SQLALCHEMY_DATABASE_URI": db_url + '/' + db_name,
        "SQLALCHEMY_TRACK_MODIFICATIONS": False
    }

    app = create_app(test_config)

    with app.app_context():
        db.create_all()
        # initialize_db(db_conn)
        yield app

        # Close the database session and drop all tables after the session
        db.session.remove()
        db.drop_all()

@pytest.fixture
def test_client(app):
    return app.test_client()