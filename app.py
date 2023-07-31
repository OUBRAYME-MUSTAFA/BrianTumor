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

app = Flask(__name__, static_folder="src/static")
PATH = '';
name  ='';

@app.route('/')
def index():
    return render_template('index.html')


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
    ff = nib.load(os.path.join('templates/uploads/Fixed', file.filename))
    print(ff.shape[2])

    file1 = request.files['ImageMoving']
    file1.save(os.path.join('templates/uploads/Moving', file1.filename))
    ff1 = nib.load(os.path.join('templates/uploads/Moving', file1.filename))
    print(ff1.shape[2])
    global PATH
    global name 
    PATH = os.path.join('templates/uploads/Moving', file1.filename)
    name = file1.filename
    print('-----------------------------------',PATH)
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



















    # nifti_data_base64 = base64.b64encode(ff1).decode('utf-8')
    # print(nifti_data_base64)
    # return jsonify(processed_data=file1.filename)


    # return send_file(ff1, mimetype='application/gzip')
    # v1 = file.filename
    # v2 =  'bel3id2'
    # v3 =  'bel3id3'

    # return render_template('index.html', v1=v1 , v2=v2, v3=v3)


# @app.route('/load', methods=['POST'])
# def load():
#     file_path = request.form['file_path']

#     # Validate the file path and check if it exists
#     if not os.path.isfile(file_path):
#         return jsonify({'success': False, 'message': 'Invalid file path'})

#     return jsonify({'success': True})

# @app.route('/get_num_slices', methods=['POST'])
# def get_num_slices():
#     # file = request.form.get('file')
#     file = request.data
#     print("**********")
#     print(type(file))

#     nifti_image = nib.load(file)

#     # Extract the number of slices
#     num_slices = file.shape[2]
#     print("**************")
#     print(num_slices)
#     return jsonify({'success': True, 'num_slices': num_slices})

# @app.route('/get_slice', methods=['GET'])
# def get_slice():
#     print("start getting clices ")

#     slice_index = int(request.args.get('index'))
#     file = request.args.get('file')

#     # nii_data = file
#     # data_array = nii_data.get_fdata()
#     slice_data = file[:, :, slice_index]
#     slice_data_normalized = (slice_data - np.min(slice_data)) / (np.max(slice_data) - np.min(slice_data)) * 255

#     # Save the slice data as a temporary image file
#     with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_img:
#         plt.imsave(temp_img.name, slice_data_normalized, cmap='gray', format='png')

#     return send_file(temp_img.name, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
