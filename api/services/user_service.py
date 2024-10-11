from models.user import User


class UserService():
    def __init__(self, db):
        self.db = db

    def create_user(self, username, password):
        user = User(username, password)
        self.db.session.add(user)
        self.db.session.commit()