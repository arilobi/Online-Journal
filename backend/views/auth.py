from flask import jsonify, request, Blueprint
from models import db, User, TokenBlocklist
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import check_password_hash
from datetime import datetime
from datetime import timedelta
from datetime import timezone

auth_bp = Blueprint("auth_bp", __name__)

# ---> Adding a login 
@auth_bp.route("/login", methods=["POST"])
def login():
    # ---> Get data from the request
    data = request.get_json()
    
    if not data or "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password are required"}), 400
    
    email = data["email"]
    password = data["password"]

    # ---> Find the user by email
    user = User.query.filter_by(email=email).first()

    # ---> If the user exists and the password hash matches
    if user and check_password_hash(user.password, password):
        # Create a token (convert user ID to string if necessary)
        access_token = create_access_token(identity=str(user.id))
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"error": "Either email/password is incorrect"}), 404

# --->Get the current user
@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()  # Requires valid JWT in Authorization header
def current_user():
    # ---> Get current user's ID from the JWT token
    current_user_id = get_jwt_identity()  # This gets the user ID from the JWT

    # ---> Fetch the user from the database by their ID
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # ---> Return user information
    user_data = {
        "id": user.id,
        "email": user.email,
        "is_verified": user.is_verified,
        "name": user.name
    }

    return jsonify(user_data), 200

#---> Adding a Logout function that will add the user to the tokenblocklist that i created in the models.py
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify({"success": "Logged out successfully"})

   