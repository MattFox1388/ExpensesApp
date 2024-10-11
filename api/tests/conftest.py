from venv import create

import pytest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from app import create_app
from models.category import Category
from models.month import Month
from models.monthRecord import MonthRecord
from models.monthStat import MonthStat


@pytest.fixture
def flask_app_mock():
    app_mock = Flask(__name__)
    db = SQLAlchemy(app_mock)
    db.init_app(app_mock)
    return app_mock


@pytest.fixture
def mock_month_object():
    return [Month(id=1, month_name='JAN')]


@pytest.fixture
def mock_category_object():
    return Category(id=1, cat_type='cat1')


@pytest.fixture
def mock_month_record_object():
    return [MonthRecord(id=1, descr='this is a month record')]


@pytest.fixture
def mock_month_record_multi():
    return [MonthRecord(id=1, descr='first'), MonthRecord(id=2, descr='second')]


@pytest.fixture
def mock_month_record_object_no_list():
    return MonthRecord(id=2, descr='second month record')


@pytest.fixture
def mock_month_stat_object():
    return [MonthStat(id=1)]


@pytest.fixture
def mock_month_object_no_list():
    return Month(id=1, month_name='JAN')


@pytest.fixture
def mock_get_sqlalchemy(mocker):
    mock = mocker.patch("flask_sqlalchemy._QueryProperty.__get__").return_value = mocker.Mock()
    return mock


@pytest.fixture
def mock_is_valid_token(mocker):
    mocker.patch("app.is_token_valid", return_value=(True, {}))


@pytest.fixture
def mock_parse_checkings_process_rows(mocker):
    mocker.patch("services.parse_checkings.ParseCheckings.process_rows", return_value=5)


@pytest.fixture
def mock_parse_checkings_close_session(mocker):
    return mocker.patch("services.parse_checkings.ParseCheckings.close_session", return_value=None)


@pytest.fixture
def mock_parse_savings_close_session(mocker):
    return mocker.patch("services.parse_savings.ParseSavings.close_session", return_value=None)


@pytest.fixture
def mock_uncategorized_services_set_multiple_record_categories(mocker):
    return mocker.patch(
        "services.uncategorized_items_services.UncategorizedItemsService.set_multiple_record_categories",
        return_value='Month records updated: 1')


@pytest.fixture
def mock_uncategorized_services_ignore_uncategorized_items(mocker):
    return mocker.patch(
        "services.uncategorized_items_services.UncategorizedItemsService.ignore_uncategorized_items",
        return_value='Ignored: 1',
    )


@pytest.fixture
def mock_parse_savings_process_rows(mocker):
    return mocker.patch("services.parse_savings.ParseSavings.process_rows", return_value=3)


@pytest.fixture
def mock_parse_disc_process_rows(mocker):
    mocker.patch("services.parse_disc.ParseDisc.process_rows", return_value=4)


@pytest.fixture
def mock_parse_disc_close_session(mocker):
    return mocker.patch("services.parse_disc.ParseDisc.close_session", return_value=None)


@pytest.fixture()
def client():
    test_client = create_app()
    return test_client.test_client()
