from alcem import db

from models.monthRecord import MonthRecord
from models.monthStat import MonthStat


class Month(db.Model):
    id: int = db.Column(db.Integer, primary_key=True, nullable=False)
    month_name: str = db.Column(db.String(100), unique=True, nullable=False)
    monthsRecords = db.relationship('MonthRecord')
    monthStats = db.relationship('MonthStat')

    def __repr__(self):
        return 'id: {}, month name: {}'.format(self.id, self.month_name)
