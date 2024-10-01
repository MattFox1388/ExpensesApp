import unittest
from unittest import mock

from models.uncategorizedItem import UncategorizedItem
from services.parse_checkings import ParseCheckings


class TestParseCheckings(unittest.TestCase):
    def setUp(self):
        self.db = mock.MagicMock()
        self.parse_checkings = ParseCheckings(self.db)

    def test_add_uncategorized_rows_to_be_revisited(self):
        self.parse_checkings.add_uncategorized_rows_to_be_revisited([1], [2])
        uncategorized_item1 = UncategorizedItem.query.filter_by(month_record_id=1).first()
        self.assertIsNotNone(uncategorized_item1)
        self.assertTrue(uncategorized_item1.is_want_or_expense)
        uncategorized_item2 = UncategorizedItem.query.filter_by(month_record_id=2).first()
        self.assertIsNotNone(uncategorized_item2)
        self.assertTrue(uncategorized_item2.is_need_want_need_saving)
