from alcem import db


class MonthRecord(db.Model):
    id: int = db.Column(db.Integer, primary_key=True, nullable=False)
    year_num: int = db.Column(db.Integer, nullable=False)
    date_val = db.Column(db.Date, nullable=False)
    amount: float = db.Column(db.Float, nullable=False)
    descr: str = db.Column(db.String(255), nullable=False)
    is_positive: bool = db.Column(db.Boolean, nullable=False)
    month_id: int = db.Column(db.Integer, db.ForeignKey('month.id'))
    cat_id: int = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)
    username: str = db.Column(db.String(255), db.ForeignKey('user.username'))
    uncategorizedItems = db.relationship('UncategorizedItem')

    def __repr__(self):
        return 'id: {}, year_num: {}, date: {}, amount: {}, descr: {}'.format(self.id, self.year_num, self.date_val,
                                                                              self.amount, self.descr)
