from alcem import db
from passlib.apps import custom_app_context as pwd_context


class User(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    username: str = db.Column(db.String(255), index=True, unique=True)
    password_hash: str = db.Column(db.String(280))

    def __init__(self, username, password):
        self.username = username
        self.hash_password(password)


    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

