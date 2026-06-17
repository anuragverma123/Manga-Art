import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from model import transform_image  

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Serve saved images back to the React app safely
@app.route('/api/uploads/<filename>', methods=['GET'])
def serve_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Hello from the clean Magi Flask backend pipeline!"})

@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image payload found"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "Empty filename submitted"}), 400
    
    # 1. Save the original raw photo
    input_filename = f"input_{file.filename}"
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
    file.save(input_path)
    
    # 2. Define the output target path
    output_filename = f"manga_{file.filename}"
    output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
    
    try:
        # 3. Execute the machine learning model pipeline!
        transform_image(input_path, output_path)

        base_url = request.host_url.rstrip("/")
        
        # 4. Return the path of the newly generated manga image back to React
        return jsonify({
            "status": "success",
            "message": "Image stylized beautifully!",
            "inputUrl": f"{base_url}/api/uploads/{input_filename}",
            "imageUrl": f"{base_url}/api/uploads/{output_filename}"
        }), 200
        
    except Exception as e:
        print(f"Inference processing error: {str(e)}")
        return jsonify({"error": f"Model inference failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)