from flask import Flask, request, render_template, redirect, url_for, send_from_directory, send_file, jsonify,session
import os
import numpy as np
import plotly.graph_objects as go
import zipfile
import io
from flask import make_response
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from werkzeug.utils import secure_filename
from OCC.Core.GCPnts import GCPnts_AbscissaPoint
from OCC.Core.STEPControl import STEPControl_Reader
from OCC.Core.BRepMesh import BRepMesh_IncrementalMesh
from OCC.Core.TopoDS import TopoDS_Vertex, TopoDS_Edge
from OCC.Core.TopExp import TopExp_Explorer
from OCC.Core.TopAbs import TopAbs_FACE, TopAbs_EDGE
from OCC.Core.BRep import BRep_Tool
from OCC.Core.GCPnts import GCPnts_UniformAbscissa
from OCC.Core.BRepAdaptor import BRepAdaptor_Curve, BRepAdaptor_Surface
from OCC.Core.BRepAlgoAPI import BRepAlgoAPI_Section
from OCC.Core.GeomLProp import GeomLProp_SLProps
from OCC.Core.GeomLib import GeomLib_Tool
from OCC.Core.TopoDS import topods, TopoDS_Shape, TopoDS_Face
from OCC.Core.Geom import Geom_Curve, Geom_Plane
from OCC.Core.Bnd import Bnd_Box
from OCC.Core.GCPnts import GCPnts_UniformAbscissa
from OCC.Core.gp import gp_Pnt, gp_Pln, gp_Ax3, gp_Dir, gp_Vec, gp_XYZ
from OCC.Core.TopExp import topexp
from OCC.Core.BRepBndLib import brepbndlib
from OCC.Core.BRepBuilderAPI import BRepBuilderAPI_MakeEdge
from OCC.Core.ShapeAnalysis import ShapeAnalysis_Edge, shapeanalysis
from OCC.Core.StlAPI import StlAPI_Writer
from OCC.Core.TopExp import TopExp_Explorer
from OCC.Core.TopoDS import TopoDS_Vertex, TopoDS_Edge
from OCC.Core.TopAbs import TopAbs_VERTEX
from OCC.Core.TopExp import TopExp_Explorer, topexp
from OCC.Core.TopAbs import TopAbs_VERTEX, TopAbs_EDGE
from OCC.Core.BRepMesh import BRepMesh_IncrementalMesh 
from OCC.Core.BRepBndLib import brepbndlib_Add
from datetime import datetime
from scipy.interpolate import CubicSpline


def plot(txt, html, plotTitle):
    def clean_line(line):
        #Removing any unwanted characters, like commas
        clean_line = line.replace(',', '').strip()
        #Spliting the cleaned line into individual string numbers
        string_numbers = clean_line.split()
        #Converting the string numbers to floats
        float_numbers = [float(num) for num in string_numbers]
        return float_numbers
    
    
    #Loading the data from the file
    file_path = txt
    data1 = []

    with open(file_path, 'r') as file:
        for line in file:
            try:
                #Cleaning and converting each line to a list of floats
                data1.append(clean_line(line))
            except ValueError as e:
                print(f"Error converting line to floats: {line}")
                print(f"Error message: {e}")

    #Converting the list of lists to a NumPy array if it's not empty
    if data1:
        s = np.array(data1)
        #Extracting x, y, z coordinates
        x = s[:, 0]
        y = s[:, 1]
        z = s[:, 2]
        #Createing a 3D plot using Plotly
        fig = go.Figure(data=[go.Scatter3d(x=x, y=y, z=z, mode='lines', marker=dict(size=2))])
        fig.update_layout(scene=dict(
            xaxis_title='X',
            yaxis_title='Y',
            zaxis_title='Z'
        ), title= plotTitle
        )
        #Saving the plot as an HTML file
        output_file = html
        fig.write_html(output_file)
        print(f"3D plot saved to {output_file}")
    else:
        print("No data to plot.")

    return s