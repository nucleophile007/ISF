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
    is_verified = db.Column(db.Boolean, default=False)
    user_role = db.Column(db.String(20), nullable=False, default="user")  # New field
 # Email verification status
   # created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(100), nullable=False)
    user_name = db.Column(db.String(100), nullable=False)
    feedback_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
