import datetime

from flask import jsonify

from models.category import Category
from models.monthRecord import MonthRecord
from models.monthStat import MonthStat
from models.uncategorizedItem import UncategorizedItem
from shared.utility import get_month_stat_category_amounts


def update_month_record(month_record_id, cat_id):
    month_record_to_update = MonthRecord.query.filter_by(id=month_record_id).one_or_none()
    month_record_to_update.cat_id = cat_id
    category = Category.query.filter_by(id=cat_id).one_or_none()
    if category is None:
        raise Exception("No category name was found with id: {}".format(cat_id))
    return month_record_to_update, category.cat_type


class UncategorizedItemsService:
    def __init__(self, db):
        self.db = db

    def close_session(self):
        self.db.session.close()

    def set_single_record_categories(self, month_record_id, cat_id):
        month_record_to_update = MonthRecord.query.filter_by(id=month_record_id).one_or_none()
        month_record_to_update.cat_id = cat_id
        self.delete_uncategorized_item(month_record_id, cat_id)

        self.db.session.commit()

    def set_multiple_record_categories(self, uncategorized_items):
        month_records_updated = 0
        for uncategorized_item in uncategorized_items:
            self.set_single_record_categories(uncategorized_item['month_record_id'], uncategorized_item['cat_id'])
            month_records_updated += 1
        self.close_session()
        return jsonify('Month records updated: {}'.format(month_records_updated))

    def delete_uncategorized_item(self, month_record_id, cat_id):
        month_record_to_update, cat_name = update_month_record(month_record_id, cat_id)
        uncat_item_id = month_record_to_update.uncategorizedItems[0].id
        self.update_month_stat_record(month_record_to_update.year_num, month_record_to_update.month_id, cat_name,
                                      month_record_to_update.amount)
        uncat_item = UncategorizedItem.query.filter_by(id=uncat_item_id).one_or_none()
        self.db.session.delete(uncat_item)

    def ignore_uncategorized_items(self, month_record_ids):
        ignored_uncat_items = 0
        for month_record_id in month_record_ids:
            self.ignore_uncategorized_item(month_record_id)
            ignored_uncat_items += 1
        self.close_session()
        return jsonify("Ignored Uncategorized Items: {}".format(ignored_uncat_items))

    def ignore_uncategorized_item(self, month_record_id):
        uncategorized_item = UncategorizedItem.query.filter_by(month_record_id=month_record_id).one_or_none()
        if uncategorized_item is not None:
            self.db.session.delete(uncategorized_item)
        month_record = MonthRecord.query.filter_by(id=month_record_id).one_or_none()
        if month_record is not None:
            self.db.session.delete(month_record)
        self.db.session.commit()

    def update_month_stat_record(self, year, month, cat_name, amount):
        month_stat_row = MonthStat.query.filter_by(year_num=year, month_id=month).one_or_none()
        needs, other, paycheck, savings, wants = get_month_stat_category_amounts(cat_name, amount, month, year)

        if month_stat_row is None:
            new_month_stat = MonthStat(month_id=month, year_num=year, date_val=datetime.date.today(),
                                       needs_actual=needs,
                                       wants_actual=wants, savings_actual=savings, paycheck_actual=paycheck,
                                       other_actual=other)
            self.db.session.add(new_month_stat)
        else:
            month_stat_row.needs_actual += needs
            month_stat_row.wants_actual += wants
            month_stat_row.savings_actual += savings
            month_stat_row.paycheck_actual += paycheck
            month_stat_row.other_actual += other
