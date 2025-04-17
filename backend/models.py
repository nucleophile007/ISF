from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

# ✅ Create one instance of db & bcrypt
db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    otp = db.Column(db.String(6), nullable=True)  # OTP field
    is_verified = db.Column(db.Boolean, default=False)  # Email verification status
   # created_at = db.Column(db.DateTime, default=db.func.current_timestamp())