import base64
import json
import os
from flask import Flask, render_template, request, jsonify, send_file , g
import imageio
import nibabel as nib
import numpy as np
import tempfile
import matplotlib.pyplot as plt
import io
import voxelmorph as vxm
import neurite as ne
import random
# imports
import os, sys

# third party imports
import numpy as np
import tensorflow as tf
assert tf.__version__.startswith('2.'), 'This tutorial assumes Tensorflow 2.0+'
from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler()

# ************************************************************************************
# ************************************************************************************
# ***************************************************Define the model 

vol_shape = (176, 176, 128)

print(vol_shape)
nb_features = [
    [16, 32, 32, 32],
    [32, 32, 32, 32, 32, 16, 16]
]
vxm_model_mse = vxm.networks.VxmDense(vol_shape, nb_features, int_steps=0)
vxm_model_ncc = vxm.networks.VxmDense(vol_shape, nb_features, int_steps=0)
vxm_model_multiple = vxm.networks.VxmDense(vol_shape, nb_features, int_steps=0)
vxm_model_mse.load_weights('templates/saved_model/vmx_mse_09v2.h5')
vxm_model_ncc.load_weights('templates/saved_model/vmx_09v2.h5')
vxm_model_multiple.load_weights('templates/saved_model/vmx_multiple_09.h5')




































app = Flask(__name__, static_folder="src/static")
PATH = '';
name  ='';



@app.route('/')
def index():
    return render_template('index2.html')
@app.route('/registration')
def registration():
    return render_template('registration.html')

@app.route('/segmentation')
def segmentation():
    return render_template('segmentation.html')

@app.route('/multi_modal')
def multi_modal():
    return render_template('multi_modal.html')

@app.route('/get_image', methods=['GET'])
def GETG():

    print('***********' ,PATH)
    return  send_file(PATH, as_attachment=True)

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'ImageFixed' not in request.files or 'ImageMoving' not in request.files:
        return 'Missing files part in the request.'
    
    file = request.files['ImageFixed']
    file.save(os.path.join('templates/uploads/Fixed', file.filename))
    img_fx = nib.load(os.path.join('templates/uploads/Fixed', file.filename)).get_fdata()

    file1 = request.files['ImageMoving']
    file1.save(os.path.join('templates/uploads/Moving', file1.filename))
    img_mv = nib.load(os.path.join('templates/uploads/Moving', file1.filename)).get_fdata()

    in_sample = get_sample(img_mv, img_fx)
    
    print("**********************************",file.filename[16:21])
    if (file.filename[16:21]=='flair'): 
            print("********************************** Start Unimodal Prediction *************************")
            val_p = vxm_model_mse.predict(in_sample)
            
    if (file.filename[16:21]=='t1ce.'): 
            print("********************************** Start Multi-modal Prediction *************************")
            val_p = vxm_model_multiple.predict(in_sample)
                   
    val_p2 = val_p[0][0, :, :, :]

    reversed_mv_data = val_p2[::, ::-1, ::]
    nifti_img = nib.Nifti1Image(reversed_mv_data, affine=None)
    

    global PATH
    global name 
    PATH = os.path.join('templates/uploads/moved', 'predicted_'+file.filename)
    nib.save(nifti_img,PATH )
    print('-------------------the image is saved in path----------------',PATH)
    return "" , 200

@app.route('/get_registered_image_json', methods=['GET'])
def get_registered_image_json():
    # Load the .nii.gz file from the server (replace 'path_to_image' with the actual path)
    image_path = PATH
    # Read the file data as bytes
    with open(image_path, 'rb') as f:
        image_data = f.read()

    # Encode the file data as a base64 string
    # base64_data = image_data.encode('base64').replace('\n', '')
    base64_data = base64.b64encode(image_data).decode('utf-8')  # Convert bytes to str


    # Create a JSON object with the file data
    response_json = {
        'filename': name,
        'data': base64_data
    }
    print ( "goooooooooooooooooooooooood")
    # Send the JSON response
    return json.dumps(response_json)

# ************************************************************************************
# ************************************************************************************
# *******************************************************function 
def get_sample(mv,fx):
    mv_images =[]
    fx_images =[]
    image_mv=mv
    image_fx=fx
    # image_mv=scaler.fit_transform(image_mv.reshape(-1, image_mv.shape[-1])).reshape(image_mv.shape)
    # image = image[56:184, 32:208, 13:141]
    mv_images.append(image_mv)
    print("Done Loading moving image ..........!!!!! with shape ",image_mv.shape)
    # image_fx=scaler.fit_transform(image_fx.reshape(-1, image_fx.shape[-1])).reshape(image_fx.shape)
    # image_fx = image_fx[32:208, 32:208, 13:141]
    fx_images.append(image_fx)
    print("Done Loading Fixed image ..........!!!!! with shape ",image_fx.shape)

    return([np.array(mv_images) ,np.array(fx_images)])

if __name__ == '__main__':
    app.run(debug=True)
