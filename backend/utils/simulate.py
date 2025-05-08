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



# def simulate(s, html1, plotTitle):
#     frames = []
#     for i in range(1, len(s) + 1):
#         frame = go.Frame(
#             data=[
#                 go.Scatter3d(
#                     x=s[:i, 0],
#                     y=s[:i, 1],
#                     z=s[:i, 2],
#                     mode='lines',
#                     line=dict(color='blue')
#                 )
#             ],
#             name=f'frame{i}'
#         )
#         frames.append(frame)

#     #Creating Plotly figure
#     fig = go.Figure(
#         data=[
#             go.Scatter3d(
#                 x=[s[0, 0]],
#                 y=[s[0, 1]],
#                 z=[s[0, 2]],
#                 mode='lines',
#                 #marker=dict(size=5, color='blue'),
#                 line=dict(color='blue')
#             )
#         ],
#         layout=go.Layout(
#             scene=dict(
#                 xaxis_title='X',
#                 yaxis_title='Y',
#                 zaxis_title='Z'
#             ),
#             title=plotTitle,
#             updatemenus=[{
#                 'type': 'buttons',
#                 'buttons': [{
#                     'label': 'Play',
#                     'method': 'animate',
#                     'args': [None, {'frame': {'duration': 1, 'redraw': True}, 'mode': 'immediate', 'transition': {'duration': 0}, 'fromcurrent': True}]
#                 }, {
#                     'label': 'Pause',
#                     'method': 'animate',
#                     'args': [[None], {'frame': {'duration': 0, 'redraw': False}, 'mode': 'immediate', 'transition': {'duration': 0}}]
#                 }]
#             }]
#         ),
#         frames=frames
#     )
#     #storing plot as html file
#     output_file = html1
#     fig.write_html(output_file)
def simulate(s, html1, plotTitle):
    import plotly.graph_objects as go

    frames = []
    for i in range(1, len(s) + 1):
        frame = go.Frame(
            data=[
                go.Scatter3d(
                    x=s[:i, 0],
                    y=s[:i, 1],
                    z=s[:i, 2],
                    mode='lines',
                    line=dict(color='#0a8098', width=2)
                )
            ],
            name=f'frame{i}'
        )
        frames.append(frame)

    # Create initial figure
    fig = go.Figure(
        data=[
            go.Scatter3d(
                x=[s[0, 0]],
                y=[s[0, 1]],
                z=[s[0, 2]],
                mode='lines',
                line=dict(color='#0a8098', width=2)
            )
        ],
        layout=go.Layout(
            title=plotTitle,
            scene=dict(
                xaxis_title='X',
                yaxis_title='Y',
                zaxis_title='Z',
                xaxis=dict(
                    backgroundcolor="white",
                    gridcolor="#e6e8eb",
                    zerolinecolor="#e6e8eb",
                    color="#0a8098"
                ),
                yaxis=dict(
                    backgroundcolor="white",
                    gridcolor="#e6e8eb",
                    zerolinecolor="#e6e8eb",
                    color="#0a8098"
                ),
                zaxis=dict(
                    backgroundcolor="white",
                    gridcolor="#e6e8eb",
                    zerolinecolor="#e6e8eb",
                    color="#0a8098"
                ),
            ),
            paper_bgcolor="rgba(10, 128, 152, 0.05)",
            plot_bgcolor="rgba(10, 128, 152, 0.05)",
            font=dict(color="#0a8098", family="Inter, sans-serif"),
            margin=dict(l=10, r=10, b=10, t=40),
            updatemenus=[{
                'type': 'buttons',
                'buttons': [
                    {
                        'label': '▶ Play',
                        'method': 'animate',
                        'args': [
                            None,
                            {
                                'frame': {'duration': 1, 'redraw': True},
                                'fromcurrent': True,
                                'transition': {'duration': 0},
                                'mode': 'immediate'
                            }
                        ]
                    },
                    {
                        'label': '⏸ Pause',
                        'method': 'animate',
                        'args': [
                            [None],
                            {
                                'frame': {'duration': 0, 'redraw': False},
                                'mode': 'immediate',
                                'transition': {'duration': 0}
                            }
                        ]
                    }
                ],
                'direction': 'left',
                'pad': {'r': 10, 't': 40},
                'showactive': True,
                'x': 0.1,
                'xanchor': 'right',
                'y': 1.1,
                'yanchor': 'top',
            }]
        ),
        frames=frames
    )
    print("yesrunnobo")
    # Save animation as HTML
    fig.write_html(html1)
    # print(f"Simulation animation saved to {html1}")
