from typing import List

from models.uncategorizedItem import UncategorizedItem
from services.parse_general import ParseGeneral, parse_general_info
from shared.enums import TransactionCategoryToDiscCategory, Disc_Category


class ParseDisc(ParseGeneral):

    def __init__(self, db):
        super().__init__()
        self.transaction_category_to_disc_category = TransactionCategoryToDiscCategory()
        self.db = db

    def add_uncategorized_rows_to_be_revisited(self, want_need_rows):
        for id in want_need_rows:
            exists = UncategorizedItem.query.filter_by(month_record_id=id).first()
            if not exists:
                uncategorized_item = UncategorizedItem(month_record_id=id, is_want_or_expense=True)
                self.db.session.add(uncategorized_item)
                self.db.session.commit()

    def process_rows(self, rows):
        categorized_rows, want_need_rows = self.add_category_to_rows(rows)
        amount_rows_processed = len(categorized_rows) + len(want_need_rows)
        self.add_uncategorized_rows_to_be_revisited(want_need_rows)
        return amount_rows_processed

    def add_category_to_rows(self, rows):
        categorized_rows = []
        want_need_rows = []
        for row in rows:
            info_dict, want_need_prompt = self.add_category_to_row(row)
            month_record_id = self.add_row_to_db(info_dict)
            if month_record_id is not None:
                if want_need_prompt is True:
                    want_need_rows.append(month_record_id)
                else:
                    categorized_rows.append(month_record_id)
        return categorized_rows, want_need_rows

    def add_category_to_row(self, row: List[str]):
        want_need_prompt = False
        result_dict, transaction_category = parse_general_info(row, posting_date='Post Date', category='Category',
                                                               is_credit_card=True)
        print('processing row: {} with category {}'.format(result_dict, transaction_category))
        no_category: str = self.transaction_category_to_disc_category.default_action()
        disc_category = self.transaction_category_to_disc_category.lookup.get(transaction_category, no_category)
        if callable(disc_category):
            disc_category = disc_category()

        if disc_category == Disc_Category.NEEDS:
            result_dict['category'] = 'Needs'
        elif disc_category == Disc_Category.SAVINGS:
            result_dict['category'] = 'Savings'
        elif disc_category == Disc_Category.PAYCHECK:
            result_dict['category'] = 'Paycheck'
        elif disc_category == Disc_Category.WANTSORNEED:
            result_dict['category'] = None
            want_need_prompt = True
        elif disc_category == Disc_Category.WANTS:
            result_dict['category'] = 'Wants'
        else:
            if not disc_category == Disc_Category.UNKNOWN:
                raise Exception("Something went wrong...")
            result_dict['category'] = None
            want_need_prompt = True

        return result_dict, want_need_prompt
