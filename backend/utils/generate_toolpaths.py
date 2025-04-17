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

f_N3=''
def gen_toolpath(f_N1, f_N2, TD1, Feed, cnc, gen_type, folder):
    # global spir_folder, cont_folder
    #tool diameter (taken as a input from user)
    TD1=float(TD1)
    #feedrate (taken as a input from user)
    Feed=int(Feed)
    #tool radius
    R1=TD1/2
    #removing the unnecessary characters from the the files storing points and normal
    #inorder to perform required calcultions 
    def clean_and_loadtxt(file_path):
        cleaned_data = []
        with open(file_path, 'r') as file:
            for line in file:
                #Replacing comas with blank
                cleaned_line = line.replace(',', ' ').strip().split()
                cleaned_row = []
                for value in cleaned_line:
                    try:
                        cleaned_row.append(float(value))
                    except ValueError:
                        print(f"Warning: Skipping invalid value '{value}'.")
                if cleaned_row:
                    cleaned_data.append(cleaned_row)
        #returing a numpy array
        return np.array(cleaned_data)
    #loading points to perform calculations
    C=clean_and_loadtxt(f_N1)
    #loading normal to perform calculations
    nC=clean_and_loadtxt(f_N2)
    #checking if they have same number of data
    print(C.shape)
    print(nC.shape)
    # if(len(C)>len(nC)):
    #     C=C[0:len(nC)]
    # if(len(C)<len(nC)):
    #     nC=nC[0:len(C)]
    if C.shape != nC.shape:
        raise ValueError("S and nS must have the same shape")
    
    TCS = C+nC*R1

    TTS = TCS.copy()

    TTS[:, 2] = TCS[:, 2]-R1

    L = TTS.shape[0]

    LNO = 4
    
    file_name=gen_type+".mpf"
    #file path for stotring toolpath(change the address to the address of your pc while locally hosting)
    file_path=f"{folder}/"+file_name
    global f_N3
    f_N3=file_path

    with open(file_path, 'w') as fid:
        #storing gcodes in the file in the format accepted by fanuc type controllers
        if cnc=='Fanuc':
            fid.write('N1 G54 F2500;\n')
            fid.write('N2 G00 Z50;\n')
            fid.write('N3 G64;\n')
            fid.write(f'N4  G01   X{TTS[0, 0]:5.5f}   Y{TTS[0, 1]:5.5f}   F{Feed:5.5f};\n')

            for i in range(L):
                fid.write(f'N{LNO + i + 1}  G01   X{TTS[i, 0]:5.5f}   Y{TTS[i, 1]:5.5f}   Z{TTS[i, 2]:5.5f};\n')

            fid.write(f'N{LNO + L + 1}  G01  Z50.00000;\n')
            fid.write(f'N{LNO + L + 2}  M30;\n')
        #storing gcodes in the file in the format accepted by siemens controllers
        elif cnc=='Siemens':
            fid.write('N1 G54 F2500\n')
            fid.write('N2 G00 Z=50\n')
            fid.write('N3 G64\n')
            fid.write(f'N4  G01   X={TTS[0, 0]:5.5f}   Y={TTS[0, 1]:5.5f}   F{Feed:5.5f}\n')

            for i in range(L):
                fid.write(f'N{LNO + i + 1}  G01   X={TTS[i, 0]:5.5f}   Y={TTS[i, 1]:5.5f}   Z={TTS[i, 2]:5.5f}  F{Feed:5.5f}\n')

            fid.write(f'N{LNO + L + 1}  G01  Z=50.00000  F{Feed:5.5f}\n')
            fid.write(f'N{LNO + L + 2}  M30\n')