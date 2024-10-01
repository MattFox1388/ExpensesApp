from alcem import db


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    cat_type = db.Column(db.String(100), unique=True, nullable=False)
    monthsRecords = db.relationship('MonthRecord', backref='category')

    def __repr__(self):
        return 'id: {}, cat type: {}'.format(self.id, self.cat_type)
