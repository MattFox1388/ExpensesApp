from alcem import db


class UncategorizedItem(db.Model):
    id: int = db.Column(db.Integer, primary_key=True, nullable=False)
    month_record_id: int = db.Column(db.Integer, db.ForeignKey('month_record.id'))
    is_want_or_expense: bool = db.Column(db.Boolean, nullable=False, default=False)
    is_need_want_saving: bool = db.Column(db.Boolean, nullable=False, default=False)
    is_should_be_ignored: bool = db.Column(db.Boolean, nullable=False, default=False)
    is_expense_or_ignore: bool = db.Column(db.Boolean, nullable=False, default=False)

    def __repr__(self):
        return 'id: {}, month record id: {}, is_want_or_expense: {}, is_need_want_saving: {}, is_should_be_ignored: {}' \
            .format(self.id, self.month_record_id, self.is_want_or_expense, self.is_need_want_saving,
                    self.is_should_be_ignored)
