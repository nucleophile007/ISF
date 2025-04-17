from flask import Blueprint, request, jsonify, send_from_directory, current_app
from werkzeug.utils import secure_filename
import os
from utils.converter import convert_step_to_stl
from utils.process_step_file import process_step_file
from utils.generate_toolpaths import gen_toolpath
from utils.plot import plot
from datetime import datetime
file = Blueprint("file", __name__)
import numpy as np
UPLOAD_FOLDER1 = "STEPonly"
CONVERTED_FOLDER = "converted"

os.makedirs(UPLOAD_FOLDER1, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)
sspiral = np.empty((2, 3))
scontour = np.empty((2, 3))

BASE_PATH = "./"
UPLOAD_FOLDER = os.path.join(BASE_PATH, "upload1")
Users_FOLDER = os.path.join(BASE_PATH, "users")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(Users_FOLDER, exist_ok=True)
@file.route("/upload", methods=["POST"])
def upload_file():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER1, filename)
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


# @file.route("/upload2", methods=["POST"])
# def upload_file2():
#     try:
#         uploaded_file = request.files.get("file")
#         if not uploaded_file or uploaded_file.filename == '':
#             return jsonify({"error": "No file selected"}), 400

#         # if not allowed_file(uploaded_file.filename):
#         #     return jsonify({"error": "Only STEP/STP files allowed"}), 400

#         # Extract user info (assumed to be passed from frontend)
#         email = request.form.get('email')
#         if not email:
#             return jsonify({"error": "Email is required"}), 400

#         username = email.split('@')[0]
#         filename = secure_filename(uploaded_file.filename)
#         step_path = os.path.join(UPLOAD_FOLDER, filename)
#         uploaded_file.save(step_path)

#         date_time = datetime.now().strftime("%Y-%m-%d %H-%M-%S")
#         contour_folder = os.path.join(Users_FOLDER, email, f"Contour_{date_time}")
#         spiral_folder = os.path.join(Users_FOLDER, email, f"Spiral_{date_time}")
#         os.makedirs(contour_folder, exist_ok=True)
#         os.makedirs(spiral_folder, exist_ok=True)

#         # Get parameters
#         TD1 = request.form.get('tool_dia')
#         Feed = request.form.get('feedrate')
#         dz = request.form.get('incremental_depth')
#         cnc = request.form.get('cnc')

#         if not all([TD1, Feed, dz, cnc]):
#             return jsonify({"error": "Missing toolpath parameters"}), 400

#         dz = float(dz)

#         shape = load_step(step_path)
#         if shape is None:
#             return jsonify({"error": "Failed to load STEP file"}), 400

#         # Convert to STL and get filename
#         stl_path = convert_step_to_stl(step_path, os.path.join(Users_FOLDER, email))
#         stl_filename = os.path.basename(stl_path)

#         # Define paths for toolpath points and normals
#         pnt_contour_path = os.path.join(contour_folder, "pntContour.txt")
#         n_contour_path = os.path.join(contour_folder, "nContour.txt")
#         pnt_spiral_path = os.path.join(spiral_folder, "pntSpiral.txt")
#         n_spiral_path = os.path.join(spiral_folder, "nSpiral.txt")

#         process_step_file(step_path, contour_folder, spiral_folder)

#         # Generate G-code toolpaths
#         gen_toolpath(pnt_contour_path, n_contour_path, TD1, Feed, cnc, 'contourSPIF_', contour_folder)
#         gen_toolpath(pnt_spiral_path, n_spiral_path, TD1, Feed, cnc, 'spiralSPIF_', spiral_folder)

#         # Generate plots
#         contour_html_path = os.path.join(BASE_PATH, "static", "pnt.html")
#         spiral_html_path = os.path.join(BASE_PATH, "static", "spnt.html")

#         scontour = plot(pnt_contour_path, contour_html_path, 'Contour Trajectory')
#         sspiral = plot(pnt_spiral_path, spiral_html_path, 'Spiral Trajectory')

#         return jsonify({
#             "message": "File processed successfully",
#             "stl_url": f"/users/{email}/{stl_filename}",
#             "contour_plot": "/static/pnt.html",
#             "spiral_plot": "/static/spnt.html"
#         })

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
UPLOAD_FOLDER2 = "upload1"
CONVERTED_FOLDER = "converted"
Users_FOLDER = "users"
BASE_PATH = "./"

os.makedirs(UPLOAD_FOLDER2, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)
os.makedirs(Users_FOLDER, exist_ok=True)
os.makedirs(os.path.join(BASE_PATH, "static"), exist_ok=True)
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'step', 'stp'}
@file.route("/upload2", methods=["POST"])
def upload_file2():
    global email,dz
    global scontour, sspiral
    try:
        uploaded_file = request.files.get("file")
        if not uploaded_file or uploaded_file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        if not allowed_file(uploaded_file.filename):
            return jsonify({"error": "Only STEP/STP files allowed"}), 400

        email = request.form.get('email')
        if not email:
            return jsonify({"error": "Email is required"}), 400

        # File paths
        filename = email  # No extension
        step_path = os.path.join(UPLOAD_FOLDER2, filename)
        uploaded_file.save(step_path)

        date_time = datetime.now().strftime("%Y-%m-%d %H-%M-%S")
        global contour_folder, spiral_folder
        contour_folder = os.path.join(Users_FOLDER, email, f"Contour_{date_time}")
        spiral_folder = os.path.join(Users_FOLDER, email, f"Spiral_{date_time}")
        os.makedirs(contour_folder, exist_ok=True)
        os.makedirs(spiral_folder, exist_ok=True)

        # Toolpath Parameters
        TD1 = request.form.get('tool_dia')
        Feed = request.form.get('feedrate')
        dz = request.form.get('incremental_depth')
        cnc = request.form.get('cnc')

        if not all([TD1, Feed, dz, cnc]):
            return jsonify({"error": "Missing toolpath parameters"}), 400

        dz = float(dz)

        # Load and convert STEP file

        stl_path = convert_step_to_stl(step_path, UPLOAD_FOLDER2)
        stl_filename = os.path.basename(stl_path)  # should be email.stl

        # Toolpath input/output files
        pnt_contour_path = os.path.join(contour_folder, "pntContour.txt")
        n_contour_path = os.path.join(contour_folder, "nContour.txt")
        pnt_spiral_path = os.path.join(spiral_folder, "pntSpiral.txt")
        n_spiral_path = os.path.join(spiral_folder, "nSpiral.txt")

        # Generate toolpaths and plots
        process_step_file(step_path, contour_folder, spiral_folder,dz)
        gen_toolpath(pnt_contour_path, n_contour_path, TD1, Feed, cnc, 'contourSPIF_', contour_folder)
        gen_toolpath(pnt_spiral_path, n_spiral_path, TD1, Feed, cnc, 'spiralSPIF_', spiral_folder)

        contour_html_path = os.path.join(BASE_PATH, "static", "pnt.html")
        spiral_html_path = os.path.join(BASE_PATH, "static", "spnt.html")

        scontour = plot(pnt_contour_path, contour_html_path, 'Contour Trajectory')
        sspiral = plot(pnt_spiral_path, spiral_html_path, 'Spiral Trajectory')

        return jsonify({
            "message": "File processed successfully",
            "stl_url": f"/converted/{stl_filename}",
            "contour_plot": "/static/pnt.html",
            "spiral_plot": "/static/spnt.html"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500