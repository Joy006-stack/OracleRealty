from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import joblib
import pandas as pd
import numpy as np
from models import db, User, Property, Prediction, Favorite

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///oraclerealty.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Connect SQLAlchemy to this Flask app
db.init_app(app)

# Initialize bcrypt for password hashing
bcrypt = Bcrypt(app)

# Load the trained model and column list ONCE when the server starts
model = joblib.load('../model/house_price_model.pkl')
model_columns = joblib.load('../model/model_columns.pkl')


@app.route('/')
def home():
    return "OracleRealty backend is running!"


@app.route('/locations', methods=['GET'])
def get_locations():
    locations = sorted(model_columns[3:])
    return jsonify({'locations': locations})


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    location = data['location']
    sqft = float(data['sqft'])
    bath = float(data['bath'])
    bhk = float(data['bhk'])

    # Validation: enforce the same realistic ratio used during training (Step 13)
    if sqft / bhk < 300:
        return jsonify({
            'error': f'For {int(bhk)} BHK, total area should be at least {int(bhk * 300)} sqft for an accurate estimate.'
        }), 400

    x = np.zeros(len(model_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk

    if location in model_columns:
        loc_index = model_columns.index(location)
        x[loc_index] = 1

    x_df = pd.DataFrame([x], columns=model_columns)
    prediction = model.predict(x_df)[0]

    # Safety check: prices should never be negative or zero
    if prediction <= 0:
        return jsonify({
            'error': 'Could not generate a reliable estimate for these inputs. Try adjusting the values.'
        }), 400

    return jsonify({'predicted_price': round(prediction, 2)})


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already registered'}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully', 'user_id': new_user.id}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid email or password'}), 401

    return jsonify({
        'message': 'Login successful',
        'user_id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role
    }), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)