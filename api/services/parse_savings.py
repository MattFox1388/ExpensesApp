from typing import List

from models.uncategorizedItem import UncategorizedItem
from services.parse_general import ParseGeneral, parse_general_info
from shared.enums import TransactionCategoryToSavingsCategory, Saving_Category


class ParseSavings(ParseGeneral):
    def __init__(self, db):
        super().__init__()
        self.transaction_category_to_savings_category = TransactionCategoryToSavingsCategory()
        self.db = db

    def add_uncategorized_rows_to_be_revisited(self, expense_or_ignore_rows, want_need_saving_rows):
        for id in expense_or_ignore_rows:
            exists = UncategorizedItem.query.filter_by(month_record_id=id).first()
            if not exists:
                uncategorized_item = UncategorizedItem(month_record_id=id, is_expense_or_ignore=True)
                self.db.session.add(uncategorized_item)
                self.db.session.commit()
        for id in want_need_saving_rows:
            exists = UncategorizedItem.query.filter_by(month_record_id=id).first()
            if not exists:
                uncategorized_item = UncategorizedItem(month_record_id=id, is_need_want_saving=True)
                self.db.session.add(uncategorized_item)
                self.db.session.commit()

    def process_rows(self, rows, username):
        categorized_rows, expense_or_ignore_rows, want_need_saving_rows = self.add_category_to_rows(rows, username)
        amount_rows_processed = len(categorized_rows) + len(expense_or_ignore_rows) + len(want_need_saving_rows)
        self.add_uncategorized_rows_to_be_revisited(expense_or_ignore_rows, want_need_saving_rows)
        return amount_rows_processed

    def add_category_to_rows(self, rows, username):
        print('rows: {}'.format(rows))
        categorized_rows = []
        expense_or_ignore_rows = []
        want_need_saving_rows = []
        for row in rows:
            print('is it dict or list: {}'.format(type(row) is dict or type(row) is list))
            if type(row) is dict or type(row) is list:
                info_dict, expense_or_ignore_prompt, want_need_saving_prompt = self.add_category_to_row(row)
                month_record_id = self.add_row_to_db(info_dict, username)
                if month_record_id is not None:
                    if expense_or_ignore_prompt is True:
                        expense_or_ignore_rows.append(month_record_id)
                    elif want_need_saving_prompt is True:
                        want_need_saving_rows.append(month_record_id)
                    else:
                        categorized_rows.append(month_record_id)
        return categorized_rows, expense_or_ignore_rows, want_need_saving_rows

    def add_category_to_row(self, row: List[str]):
        want_need_saving_prompt = False
        expense_or_ignore_prompt = False
        result_dict, transaction_category = parse_general_info(row)
        no_category: str = self.transaction_category_to_savings_category.default_action()
        savings_category = self.transaction_category_to_savings_category.lookup.get(transaction_category, no_category)

        if callable(savings_category):
            savings_category = savings_category()

        if savings_category == Saving_Category.NEEDS:
            result_dict['category'] = 'Needs'
        elif savings_category == Saving_Category.WANTS:
            result_dict['category'] = 'Wants'
        elif savings_category == Saving_Category.ISEXPENSE:
            result_dict['category'] = None
            expense_or_ignore_prompt = True
        elif savings_category == Saving_Category.PAYCHECK:
            result_dict['category'] = 'Paycheck'
        elif savings_category == Saving_Category.INTEREST:
            result_dict['category'] = 'Interest'
        else:
            if not savings_category == Saving_Category.UNKNOWN:
                raise Exception("Something went wrong...")
            result_dict['category'] = None
            want_need_saving_prompt = True

        return result_dict, expense_or_ignore_prompt, want_need_saving_prompt
