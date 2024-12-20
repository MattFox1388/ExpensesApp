import datetime
import json
import os
from functools import wraps

import jwt
import mysql.connector
from dotenv import load_dotenv
from flask import Flask, request, jsonify, session
from flask_cors import CORS

from alcem import db
from ingest.DiscoverStrategy import DiscoverStrategy
from ingest.EduCheckingsStrategy import EduCheckingsStrategy
from ingest.EduSavingsStrategy import EduSavingsStrategy
from ingest.IngestContext import IngestContext
from models.category import Category
from models.dtos.month_dto import MonthDto, MonthDtoList
from models.dtos.month_record_dto import MonthRecordDto, MonthRecordDtoList
from models.dtos.month_stat_dto import MonthStatDtoList, MonthStatDto
from models.month import Month
from models.monthRecord import MonthRecord
from models.monthStat import MonthStat
from models.user import User
from services.uncategorized_items import UncategorizedItemsService
from services.user import UserService
from services.year import build_year_stats
from shared.delete_data_db import delete_data_db
from shared.exceptions import InvalidIngestRequestDataException
from shared.sqlite_create import initialize_db
from shared.token import is_token_valid


def create_app(app_config=None):
    load_dotenv()
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:8081"])

    db_config = {
        'user': os.environ.get("DB_USER"),
        'password': os.environ.get("DB_PWD"),
        'host': os.environ.get("DB_HOST"),
        'port': os.environ.get("DB_PORT"),
    }

    if not os.environ.get("DB_URI"):
        raise RuntimeError("DATABASE_URL is not set")

    if app_config:
        app.config.update(app_config)
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DB_URI")
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
        app.config['SQLALCHEMY_PRE_PING'] = True

    app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")

    db.init_app(app)
    uncategorized_service = UncategorizedItemsService(db)
    user_service = UserService(db)
    ingest_context = IngestContext()

    def init_db():
        conn = mysql.connector.connect(**db_config)
        initialize_db(conn)

    def wipe_db():
        conn = mysql.connector.connect(**db_config)
        delete_data_db(conn)
        conn.commit()

    @app.cli.command('initdb')
    def initdb_command():
        """Initializes the database."""
        env = os.getenv('FLASK_ENV')
        if env != 'development' and env != 'test':
            print(f"Cannot run this command in {env} mode. Use 'development'.")
            return

        init_db()
        print('Initialized the database.')

    @app.cli.command('wipedb')
    def wipedb_command():
        env = os.getenv('FLASK_ENV')
        if env != 'development' and env != 'test':
            print(f"Cannot run this command in {env} mode. Use 'development'.")
            return

        wipe_db()
        print('Wiped the database.')


    def check_for_token(func):
        @wraps(func)
        def wrapped(*args, **kwargs):
            is_valid, error_obj = is_token_valid(app.config['SECRET_KEY'])
            if is_valid:
                return func(*args, **kwargs)
            return jsonify(error_obj), 403

        return wrapped


    @app.route('/')
    def hello():
        return '<h1>Budget Api</h1>'


    @app.route('/login', methods=['GET', 'POST'])
    def login():
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()
        if user and user.verify_password(password):
            session['logged_in'] = True
            token = jwt.encode({
                'user': username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),

            }, app.config['SECRET_KEY'], algorithm='HS256')
            return jsonify({'token': token})
        else:
            return jsonify({
                'message': 'Unable to verify credentials'
            }), 403

    @app.route('/users', methods=['PUT'])
    def user():
        username = request.form['username']
        password = request.form['password']
        found_user = User.query.filter_by(username=username).first()

        if found_user is not None:
            return jsonify({
                'message': 'Unable to create user. User already exists'
            }), 403
        else:
            user_service.create_user(username, password)
            return "Success", 200

    @app.route('/months', methods=['GET'])
    @check_for_token
    def get_months():
        months = Month.query.all()
        dtos = map(lambda item: MonthDto.from_orm(item), months)
        return MonthDtoList(months=list(dtos)).json()


    @app.route('/categories/type/<type_name>', methods=['GET'])
    def get_category_by_name(type_name):
        if type_name is None:
            return "No Category Parameter", 400
        category = Category.query.filter_by(cat_type=type_name.upper()).one_or_none()
        if category is None:
            return "Category type not found", 400
        return json.dumps(category.id)


    @app.route('/month-records/user/<username>', methods=['GET'])
    @check_for_token
    def get_month_records(username):
        records = MonthRecord.query.filter_by(username=username).all()
        dtos = map(lambda item: MonthRecordDto.from_orm(item), records)
        return MonthRecordDtoList(month_records=list(dtos)).json()


    @app.route('/month-stats/user/<username>', methods=['GET'])
    @check_for_token
    def get_month_stats(username):
        stats = MonthStat.query.filter_by(username=username).all()
        dtos = map(lambda item: MonthStatDto.from_orm(item), stats)
        month_stats = MonthStatDtoList(month_stats=list(dtos)).json()
        print("json: {}".format(month_stats))
        return month_stats


    @app.route('/month-stats/year/<year>/user/<username>', methods=['GET'])
    @check_for_token
    def get_year_stats(year, username):
        try:
            year = valid_year(year)
            print('year: {}'.format(year))
        except ValueError:
            return "Invalid year", 400

        month_stats = MonthStat.query.filter_by(year_num=year, username=username).all()
        response = build_year_stats(year, month_stats).toJSON()
        print('response: {}'.format(response))
        return response


    @app.route('/month-records/year/<year_num>/month/<month_val>/user/<username>', methods=['GET'])
    @check_for_token
    def get_month_records_by_year_and_month(year_num, month_val, username):
        try:
            year = valid_year(year_num)
            month = valid_month(month_val)
        except ValueError:
            return "Invalid year or month parameter", 400

        month = Month.query.filter_by(month_name=month).one_or_none()
        month_records = MonthRecord.query.filter_by(month_id=month.id, year_num=year, username=username).all()
        dtos = map(lambda item: MonthRecordDto.from_orm(item), month_records)
        return MonthRecordDtoList(month_records=list(dtos)).json()


    @app.route('/month-records/id/<param_id>', methods=['GET'])
    @check_for_token
    def get_month_record_by_id(param_id):
        month_record = MonthRecord.query.filter_by(id=param_id).one_or_none()
        dto = MonthRecordDto.from_orm(month_record)
        return dto.json()


    @app.route('/months/name/<param_name>', methods=['GET'])
    @check_for_token
    def get_month_id_by_name(param_name):
        month = Month.query.filter_by(month_name=param_name).one_or_none()
        if month is None:
            return "Month was not found with name provided", 400
        return json.dumps(month.id)


    @app.route('/edu-checking-data', methods=['POST'])
    @check_for_token
    def ingest_educators_checking_data():
        content = request.json
        print('content reg: {}'.format(content))
        ingest_context.set_strategy(EduCheckingsStrategy())
        try:
            amount_processed = ingest_context.ingest(db, content)
        except InvalidIngestRequestDataException as error:
            return error.message, 400
        return jsonify({'amount_processed': amount_processed})


    @app.route('/edu-savings-data', methods=['POST'])
    @check_for_token
    def ingest_educators_saving_data():
        content = request.json
        ingest_context.set_strategy(EduSavingsStrategy())
        try:
            amount_processed = ingest_context.ingest(db, content)
        except InvalidIngestRequestDataException as error:
            return error.message, 400
        return jsonify({'amount_processed': amount_processed})


    @app.route('/discover-data', methods=['POST'])
    @check_for_token
    def ingest_discover_data():
        content = request.json
        ingest_context.set_strategy(DiscoverStrategy())
        try:
            amount_processed = ingest_context.ingest(db, content)
        except InvalidIngestRequestDataException as error:
            return error.message, 400
        return jsonify({'amount_processed': amount_processed})


    @app.route('/month-records-uncategorized/users/<username>', methods=['GET'])
    @check_for_token
    def get_month_records_uncategorized(username):
        month_records_uncat = MonthRecord.query.filter_by(cat_id=None, username=username)
        dtos = map(lambda item: MonthRecordDto.from_orm(item), month_records_uncat)
        return MonthRecordDtoList(month_records=list(dtos)).json()


    @app.route('/month-records-uncategorized', methods=['POST'])
    @check_for_token
    def set_record_categories():
        uncategorized_items = request.json
        return uncategorized_service.set_multiple_record_categories(uncategorized_items)


    @app.route('/ignore-uncategorized-items', methods=['POST'])
    @check_for_token
    def ignore_uncategorized_items():
        month_record_ids = request.json
        return uncategorized_service.ignore_uncategorized_items(month_record_ids)


    def valid_year(year):
        if year is not None:
            year = int(year)
        else:
            raise ValueError('the year was not specified')

        if 2000 < year < 2100:
            return year
        else:
            raise ValueError('the year is outside valid range (2000-2100)')


    def valid_month(month):
        if not isinstance(month, str) and not len(month) == 3:
            raise ValueError('the month is not a string value or three characters')
        else:
            month = month.upper()

        if month == 'JAN' or month == 'FEB' or month == 'MAR' or month == 'APR' or month == 'MAY' or month == 'JUN' \
                or month == 'JUL' or month == 'AUG' or month == 'SEP' or month == 'OCT' or month == 'NOV' or month == 'DEC':
            return month
        else:
            raise ValueError('the month is not valid')

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    should_debug = True if os.getenv('FLASK_ENV') == 'development' else False
    app.run(debug=should_debug)