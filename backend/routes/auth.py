import random
import string
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    create_access_token,
)
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
from models import db, User,Feedback
from itsdangerous import URLSafeTimedSerializer
import os

bcrypt = Bcrypt()
auth = Blueprint("auth", __name__)
mail = Mail()  # Mail object initialized here
serializer = URLSafeTimedSerializer("your-secret-key")


# Function to generate a 6-digit OTP
def generate_otp():
    return "".join(random.choices(string.digits, k=6))

@auth.route("/api/signup", methods=["POST"])
def signup():
    if not current_app.config.get("ALLOW_SIGNUP", True):
        return jsonify({"success": False, "message": "Signup is currently disabled by admin."}), 403
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"success": False, "message": "All fields are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email already in use"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    otp = generate_otp()

    # Send OTP email
    try:
        with current_app.app_context():
            msg = Message(
                "Your OTP Code", 
                sender="your-email@example.com",  # Specify sender
                recipients=[email]
            )
            msg.body = f"Your OTP code is {otp}. Use this to verify your account."
            mail.send(msg)
    except Exception as e:
        return jsonify({"success": False, "message": f"Error sending OTP: {str(e)}"}), 500

    # Temporarily store user details in session (or cache if needed)
    current_app.config['PENDING_USERS'] = current_app.config.get('PENDING_USERS', {})
    current_app.config['PENDING_USERS'][email] = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "otp": otp
    }
    
    return jsonify({"success": True, "message": "OTP sent. Please verify your email."}), 201

@auth.route("/api/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    pending_users = current_app.config.get('PENDING_USERS', {})
    user_data = pending_users.get(email)

    if not user_data or user_data["otp"] != otp:
        return jsonify({"success": False, "message": "Invalid OTP"}), 400

    # Create and store the verified user
    new_user = User(
        name=user_data["name"], 
        email=user_data["email"], 
        password=user_data["password"], 
        is_verified=True
    )
    db.session.add(new_user)
    db.session.commit()

    # Remove from pending users
    del current_app.config['PENDING_USERS'][email]

    return jsonify({"success": True, "message": "Account verified and created successfully."}), 200

@auth.route("/api/login", methods=["POST"])
def login():
    if not current_app.config.get("ALLOW_LOGIN", True):
        return jsonify({"success": False, "message": "Login is currently disabled by admin."}), 403

    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    if not user.is_verified:
        return jsonify({"success": False, "message": "Please verify your email first"}), 403

    token = create_access_token(identity=user.email)

    return jsonify({
        "success": True,
        "message": "Login successful",
        "token": token,
        "user_role": user.user_role  # 👈 include role in response
    }), 200


from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin

@auth.route("/api/me", methods=["GET", "OPTIONS"])
@cross_origin(
    origins=["http://localhost:3000", "http://10.200.254.39:3000" ,"http://10.200.20.205:5001"],
    supports_credentials=True,
    methods=["GET", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"]
)
@jwt_required(optional=True)
def get_user():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "name": user.name,
        "email": user.email,
        "id": user.id
    })
    

@auth.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json
    email = data.get("email")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"success": False, "message": "Email not found"}), 404

    # Generate a unique token valid for 30 minutes
    token = serializer.dumps(email, salt="password-reset-salt")

    # Send reset email
    reset_url = f"http://localhost:3000/reset-password?token={token}"
    try:
        with current_app.app_context():
            msg = Message(
                "Password Reset Request",
                sender="your-email@example.com",
                recipients=[email],
            )
            msg.body = f"Click the link to reset your password: {reset_url}"
            mail.send(msg)
    except Exception as e:
        return jsonify({"success": False, "message": f"Error sending email: {str(e)}"}), 500

    return jsonify({"success": True, "message": "Reset link sent to your email"}), 200


@auth.route("/api/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    token = data.get("token")
    new_password = data.get("new_password")

    try:
        email = serializer.loads(token, salt="password-reset-salt", max_age=1800)  # 30 min expiry
    except:
        return jsonify({"success": False, "message": "Invalid or expired token"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    user.password = bcrypt.generate_password_hash(new_password).decode("utf-8")
    db.session.commit()

    return jsonify({"success": True, "message": "Password reset successful"}), 200

@auth.route("/api/feedback", methods=["POST"])
@jwt_required()
def add_feedback():
    user_email = get_jwt_identity()  # this returns email, not ID
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    feedback_text = data.get('feedback_text')
    
    if not feedback_text:
        return jsonify({'error': 'Feedback text is required'}), 400

    feedback = Feedback(
        user_email=user.email,
        user_name=user.name,
        feedback_text=feedback_text
    )
    db.session.add(feedback)
    db.session.commit()

    return jsonify({'message': 'Feedback submitted successfully'}), 201

@auth.route("/api/admin/feedback", methods=["GET"])
def get_all_feedback():
    # Get the page and limit from query parameters
    page = request.args.get('page', 1, type=int)  # Default page = 1
    limit = request.args.get('limit', 10, type=int)  # Default limit = 10

    # Fetch paginated feedback from the database
    feedback_query = Feedback.query.paginate(page=page, per_page=limit, error_out=False)

    # Prepare the response data
    feedback_data = []
    for fb in feedback_query.items:
        feedback_data.append({
            'id': fb.id,
            'user_email': fb.user_email,
            'user_name': fb.user_name,
            'feedback_text': fb.feedback_text,
            'created_at': fb.created_at
        })

    # Response with pagination metadata
    response = {
        'data': feedback_data,
        'total': feedback_query.total,
        'pages': feedback_query.pages,
        'current_page': feedback_query.page,
    }

    return jsonify(response), 200


@auth.route("/api/admin/toggle-signup", methods=["POST"])
def toggle_signup():
    current_state = current_app.config.get("ALLOW_SIGNUP", True)
    current_app.config["ALLOW_SIGNUP"] = not current_state
    return jsonify({"signup_allowed": current_app.config["ALLOW_SIGNUP"]})

@auth.route("/api/admin/toggle-login", methods=["POST"])
def toggle_login():
    current_state = current_app.config.get("ALLOW_LOGIN", True)
    current_app.config["ALLOW_LOGIN"] = not current_state
    return jsonify({"login_allowed": current_app.config["ALLOW_LOGIN"]})

@auth.route("/api/admin/status", methods=["GET"])
def get_status():
    return jsonify({
        "signup_allowed": current_app.config.get("ALLOW_SIGNUP", True),
        "login_allowed": current_app.config.get("ALLOW_LOGIN", True)
    })