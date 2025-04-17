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

def FindStart(edges, ordered_edges, start_point):
    distance = 100000
    startEdgeNo = 0
    nEdges = len(edges)
    for i in range(0,nEdges):
        iEdge = edges[i]
        v1, v2 = get_edge_vertices(iEdge)
        pnt_v1 = BRep_Tool.Pnt(v1)
        dist1 = pnt_v1.Distance(start_point)
        if(dist1 < distance):
            startEdgeNo = i
            distance = dist1
            # print(startEdgeNo)
    aEdge = edges[startEdgeNo]
    # print(startEdgeNo)
    edges[startEdgeNo] = edges[0]
    edges[0] = aEdge

    for i in range(0,nEdges):
        ordered_edges.append(edges[i])
    return edges

def stPnt(st_pnt,edges):
    ordered_edges=[]
    return FindStart(edges,ordered_edges,st_pnt)

def get_edge_vertices(aEdge):
    # Initialize an explorer to find vertices
    explorer = TopExp_Explorer(aEdge, TopAbs_VERTEX)

    # Get the first vertex
    first_vertex = None
    last_vertex = None
    if explorer.More():
        first_vertex = TopoDS_Vertex(explorer.Current())
        explorer.Next()
    
    # Get the last vertex
    while explorer.More():
        last_vertex = TopoDS_Vertex(explorer.Current())
        explorer.Next()
    
    return first_vertex, last_vertex

def vertices_are_equal(vertex1, vertex2, tolerance):
    # Extract 3D coordinates from the vertices
    p1 = BRep_Tool.Pnt(vertex1)
    p2 = BRep_Tool.Pnt(vertex2)

    # Compare the coordinates of the two points with tolerance
    return (abs(p1.X() - p2.X()) < tolerance and
            abs(p1.Y() - p2.Y()) < tolerance and
            abs(p1.Z() - p2.Z()) < tolerance)

def orientedEdges(ord_edges):
    oriented_edges = []
    # Add loop orientation if applicable
    dir_loop_orientation = gp_Dir(0, 0, 1)  # Set loop orientation appropriately
    OrientLoop(ord_edges, oriented_edges, dir_loop_orientation)
    return oriented_edges

def EdgesOrdering(slice_edges, ordered_edges):
    ordered_edges.clear()

    if not slice_edges:
        return

    # Loop until all edges in slice_edges are exhausted or no further connections are possible
    bEdgeReversed = False  # Tracks if the current edge needs to be reversed
    edge_found = True  # Tracks if a new edge was found in each iteration

    while slice_edges and edge_found:
        edge_found = False  # Reset edge_found for each loop iteration

        # Initialize the first edge by finding any pair that shares a vertex
        if not ordered_edges:
            for i, edge in enumerate(slice_edges):
                first_edge_vertex, last_edge_vertex = get_edge_vertices(edge)
                
                # Check if it matches with any other edge in slice_edges
                for j, candidate_edge in enumerate(slice_edges):
                    if i == j:
                        continue  # Skip the same edge
                    candidate_first, candidate_last = get_edge_vertices(candidate_edge)

                    if (vertices_are_equal(first_edge_vertex, candidate_first, 1e-6) or 
                        vertices_are_equal(first_edge_vertex, candidate_last, 1e-6) or 
                        vertices_are_equal(last_edge_vertex, candidate_first, 1e-6) or 
                        vertices_are_equal(last_edge_vertex, candidate_last, 1e-6)):
                        ordered_edges.append(slice_edges.pop(i))  # Add this edge as starting edge
                        edge_found = True
                        break
                if edge_found:
                    break

        # Try to find the next edge that connects to the current sequence
        if ordered_edges:
            current_edge = ordered_edges[-1]
            first_vertex, last_vertex = get_edge_vertices(current_edge)
            last_vertex_to_compare = last_vertex if not bEdgeReversed else first_vertex

            next_edge = None
            for i, edge in enumerate(slice_edges):
                first_edge_vertex, last_edge_vertex = get_edge_vertices(edge)

                # Compare vertices with a tolerance
                if vertices_are_equal(last_vertex_to_compare, first_edge_vertex, 1e-6):
                    next_edge = edge
                    bEdgeReversed = False  # Edge is connected as is
                    slice_edges.pop(i)
                    edge_found = True
                    break
                elif vertices_are_equal(last_vertex_to_compare, last_edge_vertex, 1e-6):
                    next_edge = edge
                    bEdgeReversed = True  # Edge needs to be reversed
                    slice_edges.pop(i)
                    edge_found = True
                    break

            if next_edge:
                ordered_edges.append(next_edge)

def OrientLoop(ordered_edges, oriented_edges, loop_orientation):
    # Check if the orientation vector is valid
    # if loop_orientation.X() == 0 and loop_orientation.Y() == 0 and loop_orientation.Z() == 0:
    #     return  # Invalid orientation vector

    # Get the vertices of the ordered edges
    first_vertices = []
    for i in range(0,len(ordered_edges)):
        first_vertex, _ = get_edge_vertices(ordered_edges[i])
        first_point = BRep_Tool.Pnt(first_vertex)
        first_vertices.append(first_point)

    # Close the loop by appending the first vertex again at the end
    first_vertices.append(first_vertices[0])

    # Calculate the area of the loop using the cross product
    area = 0
    origin = gp_Pnt(0, 0, 0)
    for i in range(1, len(first_vertices)):
        point1 = first_vertices[i - 1]
        point2 = first_vertices[i]
        vec1 = gp_Vec(point1, origin)
        vec2 = gp_Vec(point2, origin)
        vec_area = vec1.Crossed(vec2)
        area += vec_area.Z()
        
    # Determine the orientation of the loop relative to the input direction
    if area * loop_orientation.Z() < 0:
        # Reverse the loop if necessary
        for edge in reversed(ordered_edges):
            oriented_edges.append(edge.Reversed())
    else:
        # Add edges in the original order
        for edge in ordered_edges:
            oriented_edges.append(edge)
      
def is_loop_reversed(ordered_edges):
    """ Determines if the loop is reversed based on computed area. """
    first_vertices = [BRep_Tool.Pnt(get_edge_vertices(edge)[0]) for edge in ordered_edges]
    first_vertices.append(first_vertices[0])  # Close the loop

    area = 0
    origin = gp_Pnt(0, 0, 0)

    for i in range(1, len(first_vertices)):
        p1 = first_vertices[i - 1]
        p2 = first_vertices[i]
        v1 = gp_Vec(p1, origin)
        v2 = gp_Vec(p2, origin)
        area += v1.Crossed(v2).Z()

    return area < 0  # If area is negative, loop is reversed

def orderedEdges(slice_edges):
    ordered_edges = []
    EdgesOrdering(slice_edges, ordered_edges)

    if ordered_edges:
        # Compute loop normal to check orientation
        if is_loop_reversed(ordered_edges):  # Check if the loop is inverted
            ordered_edges.reverse()  # Reverse edge order
            ordered_edges = [edge.Reversed() for edge in ordered_edges]  # Flip edge orientation

    return ordered_edges

def toTopoDS_Edge(shape):
    if isinstance(shape, TopoDS_Edge):
        return shape
    elif isinstance(shape, TopoDS_Shape):
        try:
            edge = topods.Edge(shape)
            return edge
        except Exception as e:
            raise ValueError(f"Conversion to TopoDS_Edge failed: {e}")
    else:
        raise TypeError("Cannot convert shape to TopoDS_Edge")

def GeneratePoints(aEdge, vContPnts, startPnt, length):
    # Get the vertices of the edge
    first_vertex, last_vertex = get_edge_vertices(aEdge)
    # print(aEdge)
    # Get the geometric points of the vertices
    pnt_f_vertex = BRep_Tool.Pnt(first_vertex)
    pnt_l_vertex = BRep_Tool.Pnt(last_vertex)

    # Create a BRepAdaptor_Curve from the edge
    brep_curve = BRepAdaptor_Curve(aEdge)
    brep_first_param = brep_curve.FirstParameter()
    brep_last_param = brep_curve.LastParameter()

    # Calculate curve length
    c_length = GCPnts_AbscissaPoint.Length(brep_curve)
    length.append(c_length)  # Store the curve length

    # Number of points to generate along the curve
    n_points = 20  # Keep this the same as before

    # Determine the direction based on distance to the start point
    if startPnt.Distance(pnt_f_vertex) < startPnt.Distance(pnt_l_vertex):
        for i in range(0, n_points + 1):
            param = brep_first_param + (brep_last_param - brep_first_param) * (i / n_points)
            pnt = brep_curve.Value(param)
            vContPnts.append(pnt)  # Store gp_Pnt in the vContPnts list
    else:
        for i in range(0, n_points + 1):
            param = brep_last_param - (brep_last_param - brep_first_param) * (i / n_points)
            pnt = brep_curve.Value(param)
            vContPnts.append(pnt)  # Store gp_Pnt in the vContPnts list

    return

def pointGen(edge, ref_pnt):
    # Ordered points on the sliced edge
    pnts = []      # List to store (X, Y, Z) tuples of points
    pnts_gp = []   # List to store the gp_Pnt objects (geometric points)

    # Check if the input is a valid edge or can be converted to one
    if not isinstance(edge, TopoDS_Edge):
        if isinstance(edge, TopoDS_Shape):
            edge = toTopoDS_Edge(edge)  # Attempt to convert to TopoDS_Edge
        else:
            raise TypeError("The provided object is not a valid TopoDS_Edge or convertible.")

    # Call the corresponding function from gen_htp.py to calculate the start point
    startPnt = gp_Pnt(ref_pnt[0], ref_pnt[1], ref_pnt[2])  # Use gp_Pnt for the reference point
    length = []  # To store the calculated length of the edge

    # Generate points along the edge and store them in `vContPnts` (points as gp_Pnt)
    vContPnts = []
    GeneratePoints(edge, vContPnts, startPnt, length)

    # Process the generated points (vContPnts) to extract their (X, Y, Z) coordinates
    for gp_point in vContPnts:
        x, y, z = round(gp_point.X(), 1), round(gp_point.Y(), 1), round(gp_point.Z(), 1)
        pnts.append((x, y, z))     # Append the tuple (X, Y, Z) to the pnts list
        pnts_gp.append(gp_point)   # Append the gp_Pnt object to the pnts_gp list

    # Return the list of ordered points (pnts) and gp_Pnt objects (pnts_gp)
    return pnts, pnts_gp

def normalGen(gSurface, pnts_gp):
    #storing normals of generated points
    normals=[]
    nor_gp=[]
    #iterating over the points on current edge
    for npnt in pnts_gp:
            b, u, v=GeomLib_Tool.Parameters(gSurface, gp_Pnt(npnt.X(), npnt.Y(), npnt.Z()), 1)
            if b==True:
                evaluator=GeomLProp_SLProps(gSurface, u, v, 2, 1e-6)
                normal=evaluator.Normal()
                if normal.XYZ()*(z_dir.XYZ())<0:
                    #reverses the direction of normal
                    normal=-normal
                normal_vec=gp_Vec(normal)
                nor_gp.append(normal_vec)
                normal_points=(normal_vec.X(), normal_vec.Y(), normal_vec.Z())
                normals.append(normal_points)
    #returning list of normals for ordered points       
    return normals, nor_gp

def interpolate_points(points, target_count):
    """
    Resample a list of points to have exactly `target_count` points using linear interpolation.
    """
    n = len(points)
    if n == 0:
        return []  # Return empty if no points provided
    if n == 1:
        return [points[0]] * target_count  # Duplicate the single point if needed
    # print("Original points:")
    # for p in points:
    #     print(f"({p.X()}, {p.Y()}, {p.Z()})")

    # Compute cumulative distances
    distances = [0]
    for i in range(1, n):
        distances.append(distances[-1] + points[i-1].Distance(points[i]))
    total_length = distances[-1]
    
    # Handle edge case where all points are identical
    if total_length == 0:
        return [points[0]] * target_count

    new_distances = [i * total_length / (target_count - 1) for i in range(target_count)]
    resampled_points = []
    j = 0
    for d in new_distances:
        while j < n - 1 and distances[j + 1] < d:
            j += 1
        if j >= n - 1:
            resampled_points.append(points[-1])  # Use last point safely
        else:
            # Linear interpolation between points[j] and points[j+1]
            denom = (distances[j + 1] - distances[j])
            t = 0 if denom == 0 else (d - distances[j]) / denom
            
            x = points[j].X() + t * (points[j + 1].X() - points[j].X())
            y = points[j].Y() + t * (points[j + 1].Y() - points[j].Y())
            z = points[j].Z() + t * (points[j + 1].Z() - points[j].Z())

            resampled_points.append(gp_Pnt(x, y, z))  # Return as gp_Pnt
    # print("\nResampled points:")
    # for p in resampled_points:
    #     print(f"({p.X()}, {p.Y()}, {p.Z()})")

    return resampled_points

def spiralGen(pnt_slice, prevpnt_slice):
    """
    Generate a smooth spiral path between two slices.
    Ensures both slices have equal number of points.
    """
    if not pnt_slice or not prevpnt_slice:
        return []  # If either slice is empty, return an empty spiral
    # target_count = max(len(pnt_slice), len(prevpnt_slice))
    target_count = max(len(pnt_slice), len(prevpnt_slice))
    # Resample both slices to target_count
    pnt_slice_resampled = interpolate_points(pnt_slice, target_count)
    prevpnt_slice_resampled = interpolate_points(prevpnt_slice, target_count)

    # Force exact equality
    target_count = min(len(pnt_slice_resampled), len(prevpnt_slice_resampled))
    pnt_slice_resampled = pnt_slice_resampled[:target_count]
    prevpnt_slice_resampled = prevpnt_slice_resampled[:target_count]
    # **Ensure target_count is still consistent**
    assert len(pnt_slice_resampled) == len(prevpnt_slice_resampled), "Resampling failed!"
    
    # Generate spiral points
    spiralPnts = []
    for cnt in range(target_count):
        s = cnt / (target_count - 1) if target_count > 1 else 0  # Normalize `s` between 0 and 1

        # Convert gp_Pnt to gp_XYZ
        pntfirst_xyz = gp_XYZ(
            pnt_slice_resampled[cnt].X(), 
            pnt_slice_resampled[cnt].Y(), 
            pnt_slice_resampled[cnt].Z()
        ).Multiplied(s)

        pntsecond_xyz = gp_XYZ(
            prevpnt_slice_resampled[cnt].X(), 
            prevpnt_slice_resampled[cnt].Y(), 
            prevpnt_slice_resampled[cnt].Z()
        ).Multiplied(1 - s)

        # Add vectors and convert back to gp_Pnt
        combined_xyz = pntfirst_xyz.Added(pntsecond_xyz)
        sp_pnt = gp_Pnt(combined_xyz.X(), combined_xyz.Y(), combined_xyz.Z())
        spiralPnts.append(sp_pnt)
    return spiralPnts

def interpolate_normals(normals, target_count):
    """
    Resample a list of normals to have exactly `target_count` normals using linear interpolation.
    """
    n = len(normals)
    if n == 0:
        return []  # Return empty if no normals provided
    if n == 1:
        return [normals[0]] * target_count  # Duplicate the single normal if needed

    # Compute cumulative distances along the normal vectors
    distances = [0]
    for i in range(1, n):
        distances.append(distances[-1] + normals[i-1].Subtracted(normals[i]).Magnitude())

    total_length = distances[-1]

    # Handle edge case where all normals are identical
    if total_length == 0:
        return [normals[0]] * target_count

    new_distances = [i * total_length / (target_count - 1) for i in range(target_count)]
    resampled_normals = []
    j = 0

    for d in new_distances:
        while j < n - 1 and distances[j + 1] < d:
            j += 1
        if j >= n - 1:
            resampled_normals.append(normals[-1])  # Use last normal safely
        else:
            # Linear interpolation between normals[j] and normals[j+1]
            denom = (distances[j + 1] - distances[j])
            t = 0 if denom == 0 else (d - distances[j]) / denom
            
            x = normals[j].X() + t * (normals[j + 1].X() - normals[j].X())
            y = normals[j].Y() + t * (normals[j + 1].Y() - normals[j].Y())
            z = normals[j].Z() + t * (normals[j + 1].Z() - normals[j].Z())

            resampled_normals.append(gp_Vec(x, y, z))  # Return as gp_Vec

    return resampled_normals

def spnorm(slice_norm, prevnorm_slice):
    """
    Generate consistent normal vectors along the spiral by resampling both input normal sets
    to ensure they match the number of spiral points.
    """
    if not slice_norm or not prevnorm_slice:
        return []  # If either normal slice is empty, return an empty list

    # Determine the target count dynamically (same logic as spiral points)
    target_count = max(len(slice_norm), len(prevnorm_slice))

    # Resample both normal slices to target_count
    slice_norm_resampled = interpolate_normals(slice_norm, target_count)
    prevnorm_slice_resampled = interpolate_normals(prevnorm_slice, target_count)

    # Force exact equality
    target_count = min(len(slice_norm_resampled), len(prevnorm_slice_resampled))
    slice_norm_resampled = slice_norm_resampled[:target_count]
    prevnorm_slice_resampled = prevnorm_slice_resampled[:target_count]

    assert len(slice_norm_resampled) == len(prevnorm_slice_resampled), "Resampling failed for normals!"

    # Interpolate normals
    spiral_normals = []
    for cnt in range(target_count):
        s = cnt / (target_count - 1) if target_count > 1 else 0  # Normalize `s` between 0 and 1

        # Convert gp_Vec to gp_XYZ (same as points)
        normfirst_xyz = gp_XYZ(
            slice_norm_resampled[cnt].X(), 
            slice_norm_resampled[cnt].Y(), 
            slice_norm_resampled[cnt].Z()
        ).Multiplied(s)

        normsecond_xyz = gp_XYZ(
            prevnorm_slice_resampled[cnt].X(), 
            prevnorm_slice_resampled[cnt].Y(), 
            prevnorm_slice_resampled[cnt].Z()
        ).Multiplied(1 - s)

        # Add vectors and convert back to gp_Vec
        combined_xyz = normfirst_xyz.Added(normsecond_xyz)
        sp_norm = gp_Vec(combined_xyz.X(), combined_xyz.Y(), combined_xyz.Z())
        spiral_normals.append(sp_norm)

    return spiral_normals

f_N1=''
#address of files storing normals
f_N2=''
#address of files storing spiral points
f_N4=''
#address of files storing spiral normals
f_N5=''
z_dir=gp_Dir(0,0,1)
def process_step_file(step_path,contour_folder, spiral_folder,dz):
    #calling global variables
    # global spir_folder, cont_folder
    global z_dir
    global st_pnt
    global ref_pnt1
    global ref_pnt2
    
    file_name1="pntContour.txt"
    #file path for stotring points(change the address to the address of your pc while locally hosting)
    file_path1= os.path.join(contour_folder, file_name1)
    global f_N1
    f_N1=file_path1
    #Opens a file to store points  
    f1=open(file_path1,"w")

    file_name2="nContour.txt"
    #file path for stotring normal(change the address to the address of your pc while locally hosting)
    file_path2=os.path.join(contour_folder, file_name2)
    global f_N2
    f_N2=file_path2
    #Opens a file to store normals
    f2=open(file_path2,"w")

    file_name4="pntspiral.txt"
    #file path for stotring spiral points(change the address to the address of your pc while locally hosting)
    file_path4=os.path.join(spiral_folder, file_name4)
    global f_N4
    f_N4=file_path4
    #opens a file to store spiral points
    f4=open(file_path4,'w')

    file_name5="nspiral.txt"
    #file path for stotring spiral normal(change the address to the address of your pc while locally hosting)
    file_path5=os.path.join(spiral_folder, file_name5)
    global f_N5
    f_N5=file_path5
    #opens a file to store spiral normals
    f5=open(file_path5,'w')
    
    step_reader = STEPControl_Reader()
    step_reader.ReadFile(step_path)
    step_reader.TransferRoots()
    shape = step_reader.OneShape()
    def get_shape_reference_points(shape):
        # Compute the bounding box of the shape to get unique reference points
        bbox = Bnd_Box()
        brepbndlib_Add(shape, bbox)
        
        # Get the center of the bounding box as a dynamic reference point
        xmin, ymin, zmin, xmax, ymax, zmax = bbox.Get()
        center_x = (xmin + xmax) / 2
        center_y = (ymin + ymax) / 2
        center_z = (zmin + zmax) / 2

        # Set reference points dynamically based on the bounding box
        ref_pnt1 = [xmin, ymin, zmin]   # Use min corner for checking duplicates
        ref_pnt2 = [xmax, ymax, zmax]   # Use max corner for storing points
        st_pnt = gp_Pnt(xmax, ymax, zmax)  # Center of the shape for closest edge

        return ref_pnt1, ref_pnt2, st_pnt
    # Usage example with each shape
    ref_pnt1, ref_pnt2, st_pnt = get_shape_reference_points(shape)

    #creating a box around the geometry to get the height
    box = Bnd_Box()
    brepbndlib.Add(shape, box)
    z_min, z_max = box.CornerMin().Z(), box.CornerMax().Z()
    l=z_max-z_min
    # dz=0.5
    n=int(l/dz)
    
    #storing all points on slice, normals and points on spiral
    all_pnt=[]
    all_normal=[]
    all_spiralpnt=[]
    all_spnormal=[]

    #storing points on current slice
    pnt_slice=[]
    #storing points on previous slice
    prevpnt_slice=[]
    norm_slice=[]
    prevnorm_slice=[]
    #slicing with the incremental depth of dz
    for i in range(1,n):
        if i==1:
            z=z_max-0.1
        else:
            z=z-dz
        
        #defining slicing plane
        plane = gp_Pln(gp_Ax3(gp_Pnt(0, 0, z), z_dir))
        section = BRepAlgoAPI_Section(shape, plane, False)
        section.ComputePCurveOn1(True)
        section.Approximation(True)
        section.Build()
        if not section.IsDone():
            return 'Slicing failed'
    
        exp = TopExp_Explorer(section.Shape(), TopAbs_EDGE)
        #stors edges as list
        edges=[]
        BRepMesh_IncrementalMesh(shape, 0.1)
        
        # with open("edge_details.txt", "a") as f:
        edge_count = 0
        while exp.More():
                #find no.of times while occurs =>no.of edges
            edge = topods.Edge(exp.Current())
            edge_count += 1
            edges.append(edge)
            exp.Next()
        #getting first edge
        slice_edges=stPnt(st_pnt, edges)
        #getting edges ordered
        ordered_edges=orientedEdges(slice_edges)
        #getting edges oriented to have same direction of loop area
        
        oriented_edges=orderedEdges(ordered_edges)
        norm_slice.clear()
        #storing list of points on edges on a single slice
        currpnt=[]
        # edge_count1=0
        for edge in oriented_edges:
            pnts, pnts_gp = pointGen(edge, ref_pnt1)
            ref_pnt1=pnts[len(pnts)-1]
            currpnt.append(pnts)
        #storing the repeated edges
        pedge=[]
        #iterating over the list of lists of points on single edge
        for l in range(len(currpnt)):
            for m in range(l+1, len(currpnt)):
                #iterating over the list of points on single edge
                for lp in range(1,len(currpnt[0])-1):
                    #checking if any two lists has same points
                    if currpnt[l][lp]==currpnt[m][len(currpnt[0])-1-lp] or currpnt[l][lp]==currpnt[m][lp]:
                        f=0
                        for ie in pedge:
                            if ie==m:
                                f=1
                        if f==0:
                            #appending the repeated edge 
                            pedge.append(m)              
        #iterating the repeated edges to remove the from the list
        redge=[]
        for ed in pedge:
            redge.append(oriented_edges[ed])
        for redg in redge:
            oriented_edges.remove(redg)
            
        #storing current slice points
        vconstpnt=[]
        #iterating over the modified list of edges to genrate points
        for e in range(len(oriented_edges)): 
            #getting ordered points
            pnts1, pnts_gp1 = pointGen(oriented_edges[e], ref_pnt2)
            ref_pnt2=pnts1[len(pnts1)-1]
            for p in pnts_gp1:
                vconstpnt.append(p)

            #getting face containing that point
            face=TopoDS_Shape()
            bAncestor1 = BRepAlgoAPI_Section.HasAncestorFaceOn1(section, oriented_edges[e], face)
            #checking if edge lies on this face or not
            if bAncestor1==True:
                gSurface = BRep_Tool.Surface(topods.Face(face))
                #getting normal vectors on generated points
                normals ,nor_gp=normalGen(gSurface, pnts_gp1)
            for normal in normals:
                all_normal.append(normal)
            for norm in nor_gp:
                norm_slice.append(norm)

        #appending ordered points on current slice to list of all points
        for v in vconstpnt:
            all_pnt.append(v)
        
        #deleting all previous elements
        pnt_slice.clear()
        #appending points on current slice
        pnt_slice=vconstpnt
        #generating spiral points
        spiralPnts=spiralGen(pnt_slice, prevpnt_slice)
        for sp in (spiralPnts):
            all_spiralpnt.append(sp)
            
        prevpnt_slice.clear()
        #appending current slice points to previous slice points
        for spnt in (pnt_slice):
            prevpnt_slice.append(spnt)

        spnor=spnorm(norm_slice, prevnorm_slice)
        for no in spnor:
            all_spnormal.append(no)
        prevnorm_slice.clear()
        for np in norm_slice:
            prevnorm_slice.append(np)
          
    #appending all the complete list to  respective files
    #slice points
    print(len(all_pnt))
    print(len(all_normal))
    print(len(all_spiralpnt))
    print(len(all_spnormal))
    for pcontour in all_pnt:
        pnt=(pcontour.X(), pcontour.Y(), pcontour.Z())
        point_to_append1=str(pnt).replace("(","").replace(")","")
        f1.write(point_to_append1+"\n")
    #normals
    for ncontour in all_normal:
        normal_str=str(ncontour).replace("(","").replace(")","")
        f2.write(normal_str+"\n")
    #spiral points
    for sp_pnt in all_spiralpnt:
        spiral=(sp_pnt.X(), sp_pnt.Y(), sp_pnt.Z())
        str_sp=str(spiral).replace("(","").replace(")","")
        f4.write(str_sp+'\n')
    #append spiral noirmals to file
    for sp_nor in all_spnormal:
        gp_nor=(sp_nor.X(), sp_nor.Y(), sp_nor.Z())
        str_nsp=str(gp_nor).replace("(","").replace(")","")
        f5.write(str_nsp+"\n")

    
    f1.close()
    f2.close()
    f4.close()
    f5.close()
    return "Points and normals are successfully generated!"

