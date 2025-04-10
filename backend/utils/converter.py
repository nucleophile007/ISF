import os
from OCC.Core.STEPControl import STEPControl_Reader
from OCC.Core.IFSelect import IFSelect_RetDone
from OCC.Core.BRepMesh import BRepMesh_IncrementalMesh
from OCC.Extend.DataExchange import write_stl_file

def convert_step_to_stl(step_path, output_dir):
    step_reader = STEPControl_Reader()
    status = step_reader.ReadFile(step_path)

    if status != IFSelect_RetDone:
        raise ValueError("Failed to read STEP file.")

    step_reader.TransferRoots()
    shape = step_reader.OneShape()

    mesh = BRepMesh_IncrementalMesh(shape, 0.1)
    mesh.Perform()

    base_name = os.path.splitext(os.path.basename(step_path))[0]
    stl_path = os.path.join(output_dir, base_name + '.stl')
    write_stl_file(shape, stl_path)

    return stl_path
