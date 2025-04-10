from flask import Blueprint, request, jsonify, send_from_directory, current_app
from werkzeug.utils import secure_filename
import os
from utils.converter import convert_step_to_stl

file = Blueprint("file", __name__)

UPLOAD_FOLDER = "uploads"
CONVERTED_FOLDER = "converted"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)

@file.route("/upload", methods=["POST"])
def upload_file():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    if filename.lower().endswith((".step", ".stp")):
        try:
            stl_path = convert_step_to_stl(filepath, CONVERTED_FOLDER)
            stl_url = f"http://127.0.0.1:5000/converted/{os.path.basename(stl_path)}"
            return jsonify({ "stl_url": stl_url })
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    elif filename.lower().endswith(".stl"):
        dest_path = os.path.join(CONVERTED_FOLDER, filename)
        os.rename(filepath, dest_path)
        return jsonify({ "stl_url": f"http://127.0.0.1:5000/converted/{filename}" })

    return jsonify({ "error": "Unsupported file format" }), 400

@file.route("/converted/<filename>")
def serve_stl(filename):
    return send_from_directory(CONVERTED_FOLDER, filename)
