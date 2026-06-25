from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # hashed, never plain text
    phone = db.Column(db.String(20), nullable=True)
    role = db.Column(db.String(20), default='buyer')  # 'buyer', 'seller', or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships: lets us do user.properties, user.predictions, user.favorites
    properties = db.relationship('Property', backref='owner', lazy=True)
    predictions = db.relationship('Prediction', backref='user', lazy=True)
    favorites = db.relationship('Favorite', backref='user', lazy=True)


class Property(db.Model):
    __tablename__ = 'properties'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    total_sqft = db.Column(db.Float, nullable=False)
    bath = db.Column(db.Integer, nullable=False)
    bhk = db.Column(db.Integer, nullable=False)
    asking_price = db.Column(db.Float, nullable=False)
    predicted_price = db.Column(db.Float, nullable=True)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='available')  # 'available', 'sold', 'pending'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Prediction(db.Model):
    __tablename__ = 'predictions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # NULL = guest
    location = db.Column(db.String(100), nullable=False)
    total_sqft = db.Column(db.Float, nullable=False)
    bath = db.Column(db.Integer, nullable=False)
    bhk = db.Column(db.Integer, nullable=False)
    predicted_price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Favorite(db.Model):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('user_id', 'property_id', name='unique_favorite'),)