from typing import List

from models.uncategorizedItem import UncategorizedItem
from services.parse_general import ParseGeneral, parse_general_info
from shared.enums import Checking_Category, TransactionCategoryToCheckingCategory


class ParseCheckings(ParseGeneral):

    def __init__(self, db):
        super().__init__()
        self.transaction_category_to_checking_category = TransactionCategoryToCheckingCategory()
        self.db = db

    def add_uncategorized_rows_to_be_revisited(self, want_need_rows, want_need_saving_rows):
        for id in want_need_rows:
            exists = UncategorizedItem.query.filter_by(month_record_id=id).first()
            if not exists:
                uncategorized_item = UncategorizedItem(month_record_id=id, is_want_or_expense=True)
                self.db.session.add(uncategorized_item)
                self.db.session.commit()
        for id in want_need_saving_rows:
            exists = UncategorizedItem.query.filter_by(month_record_id=id).first()
            if not exists:
                uncategorized_item = UncategorizedItem(month_record_id=id, is_need_want_saving=True)
                self.db.session.add(uncategorized_item)
                self.db.session.commit()

    def process_rows(self, rows, username):
        categorized_rows, want_need_rows, want_need_saving_rows = self.add_category_to_rows(rows, username)
        amount_rows_processed = len(categorized_rows) + len(want_need_rows) + len(want_need_saving_rows)
        self.add_uncategorized_rows_to_be_revisited(want_need_rows, want_need_saving_rows)
        return amount_rows_processed

    def add_category_to_rows(self, rows, username):
        print('rows: {}'.format(rows))
        categorized_rows = []
        want_need_rows = []
        want_need_saving_rows = []
        for row in rows:
            info_dict, want_need_prompt, want_need_saving_prompt = self.add_category_to_row(row)
            month_record_id = self.add_row_to_db(info_dict, username)
            if month_record_id is not None:
                if want_need_prompt is True:
                    want_need_rows.append(month_record_id)
                elif want_need_saving_prompt is True:
                    want_need_saving_rows.append(month_record_id)
                else:
                    categorized_rows.append(month_record_id)
        return categorized_rows, want_need_rows, want_need_saving_rows

    def add_category_to_row(self, row: List[str]):
        want_need_prompt = False
        want_need_saving_prompt = False
        result_dict, transaction_category = parse_general_info(row)
        print('processing row: {} with category {}'.format(result_dict, transaction_category))
        no_category: str = self.transaction_category_to_checking_category.default_action()
        checking_category = self.transaction_category_to_checking_category.lookup.get(transaction_category, no_category)
        if callable(checking_category):
            checking_category = checking_category()

        if checking_category == Checking_Category.IGNORE:
            result_dict['category'] = 'Ignore'
        elif checking_category == Checking_Category.NEEDS:
            result_dict['category'] = 'Needs'
        elif checking_category == Checking_Category.SAVINGS:
            result_dict['category'] = 'Savings'
        elif checking_category == Checking_Category.WANTORNEED:
            result_dict['category'] = None
            want_need_prompt = True
        elif checking_category == Checking_Category.WANTS:
            result_dict['category'] = 'Wants'
        else:
            if not checking_category == Checking_Category.UNKNOWN:
                raise Exception("Something went wrong...")
            result_dict['category'] = None
            want_need_saving_prompt = True

        return result_dict, want_need_prompt, want_need_saving_prompt
