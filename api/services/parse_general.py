import datetime
from abc import abstractmethod

from models.category import Category
from models.monthRecord import MonthRecord
from models.monthStat import MonthStat
from shared.utility import get_month_stat_category_amounts


def parse_general_info(row, posting_date='Posting Date', amount='Amount', category='Transaction Category',
                       is_credit_card=False):
    print('row: {}, posting date: {}'.format(row, posting_date))
    date: str = row[posting_date]
    amount_val: str = str(abs(float(row[amount])))
    description: str = row['Description']
    transaction_category: str = row[category]
    is_positive: bool
    if is_credit_card:
        is_positive = False if float(row[amount]) > 0 else True
    else:
        is_positive = True if float(row[amount]) > 0 else False

    result_dict = {
        'date': date,
        'amount': '$' + amount_val,
        'description': description,
        'is_positive': is_positive,
    }
    return result_dict, transaction_category


def want_or_need_input() -> str:
    while True:
        print('Is this a want (y) or need (n)')
        answer = input().lower()
        if answer == 'y':
            return 'Wants'
        elif answer == 'n':
            return 'Needs'


def need_wants_savings_input() -> str:
    while True:
        print('Is this a need (n), want (w), or saving (s), paycheck (p), ignore (i)')
        answer = input().lower()
        if answer == 'w':
            return 'Wants'
        elif answer == 'n':
            return 'Needs'
        elif answer == 's':
            return 'Savings'
        elif answer == 'i':
            return 'Ignore'
        elif answer == 'p':
            return 'Paycheck'


def should_other_expense_be_ignored() -> str:
    while True:
        print('Should this expense be ignored (y/n): ')
        answer = input().lower()
        if answer == 'y':
            return 'Ignore'
        else:
            return 'Needs'


def get_date_pieces(date_str):
    arr = date_str.split('/')
    month = int(arr[0])
    day = int(arr[1])
    year = int(arr[2])
    return month, day, year


class ParseGeneral:
    def __init__(self):
        self.db = None

    @abstractmethod
    def process_rows(self, rows):
        pass

    @abstractmethod
    def add_category_to_rows(self, rows):
        pass

    @abstractmethod
    def add_category_to_row(self, row):
        pass

    def close_session(self):
        self.db.session.close()

    def add_row_to_db(self, info_dict):
        month, day, year = get_date_pieces(info_dict['date'])
        result_cat = None
        datetime_inst = datetime.datetime(year=year, month=month, day=day)

        if info_dict['category'] is not None:
            print('category before cat call: {}'.format(info_dict['category']))
            result_cat = Category.query.filter_by(cat_type=info_dict['category'].upper()).one_or_none()
            # if dup not found then add row
        does_exist_record = MonthRecord.query.filter_by(year_num=year,
                                                        date_val=datetime_inst,
                                                        amount=info_dict['amount'][1:],
                                                        descr=info_dict['description']).first()
        if does_exist_record is None and info_dict['category'] != 'Ignore':
            month_record_to_insert = MonthRecord(year_num=year, date_val=datetime.datetime(year, month, day),
                                                 amount=info_dict['amount'][1:], descr=info_dict['description'],
                                                 month_id=month, is_positive=info_dict['is_positive'],
                                                 cat_id=result_cat.id if result_cat is not None else None)
            self.db.session.add(month_record_to_insert)
            if result_cat is not None:
                self.update_month_stat_row(result_cat.cat_type, info_dict['amount'][1:], year, month)

            self.db.session.commit()

            print('id of month record: {}'.format(month_record_to_insert.id))
            return month_record_to_insert.id
        return None

    def update_month_stat_row(self, category, amount, year, month):
        month_stat_row = MonthStat.query.filter_by(year_num=year, month_id=month).one_or_none()
        needs, other, paycheck, savings, wants = get_month_stat_category_amounts(category,
                                                                                 amount, month,
                                                                                 year)

        if month_stat_row is None:
            month_stat_to_insert = MonthStat(month_id=month, year_num=year, date_val=datetime.date.today(),
                                             needs_actual=needs,
                                             wants_actual=wants, savings_actual=savings, paycheck_actual=paycheck,
                                             other_actual=other)
            self.db.session.add(month_stat_to_insert)
        else:
            month_stat_row.needs_actual += needs
            month_stat_row.wants_actual += wants
            month_stat_row.savings_actual += savings
            month_stat_row.paycheck_actual += paycheck
            month_stat_row.other_actual += other
        self.db.session.commit()
