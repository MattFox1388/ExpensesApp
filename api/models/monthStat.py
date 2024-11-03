from datetime import date

from alcem import db


class MonthStat(db.Model):
    id: int = db.Column(db.Integer, primary_key=True, nullable=False)
    year_num: int = db.Column(db.Integer, nullable=False)
    date_val: date = db.Column(db.Date, nullable=False)
    paycheck_planned: float = db.Column(db.Float, nullable=True)
    other_planned: float = db.Column(db.Float, nullable=True)
    expenses_planned: float = db.Column(db.Float, nullable=True)
    needs_planned: float = db.Column(db.Float, nullable=True)
    wants_planned: float = db.Column(db.Float, nullable=True)
    savings_planned: float = db.Column(db.Float, nullable=True)
    paycheck_actual: float = db.Column(db.Float, nullable=True)
    other_actual: float = db.Column(db.Float, nullable=True)
    expenses_actual: float = db.Column(db.Float, nullable=True)
    needs_actual: float = db.Column(db.Float, nullable=True)
    wants_actual: float = db.Column(db.Float, nullable=True)
    savings_actual: float = db.Column(db.Float, nullable=True)
    month_id: int = db.Column(db.Integer, db.ForeignKey('month.id'))
    username: str = db.Column(db.String(255), db.ForeignKey('user.username'))

    def __repr__(self):
        return 'id: {}, year_num: {}, date: {}, paycheck_planned: {}, other_planned: {}...'.format(self.id,
                                                                                                   self.year_num,
                                                                                                   self.date_val,
                                                                                                   self.paycheck_planned,
                                                                                                   self.other_planned)
