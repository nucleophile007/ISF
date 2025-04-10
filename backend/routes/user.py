from flask import Blueprint, request, jsonify
from models import User

user = Blueprint("user", __name__)

@user.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    user_list = [{"id": user.id, "name": user.name, "email": user.email} for user in users]
    return jsonify({"success": True, "users": user_list}), 200
