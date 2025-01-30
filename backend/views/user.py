from flask import jsonify, request, Blueprint
from models import db, User
from werkzeug.security import generate_password_hash

user_bp = Blueprint("user_bp", __name__)

# ---> Fetching all the users and their entries and tags
@user_bp.route("/users")
def fetch_users():
    users = User.query.all()

    user_list = []
    for user in users:
        user_list.append({
            'id':user.id,
            'email':user.email,
            'name':user.name,
            'is_verified': user.is_verified,
            "entries":[
                {
                    "id": entry.id,
                    "title": entry.title,
                    "content": entry.content,
                    "date_created": entry.date_created,
                    "data_updated": entry.date_updated,
                    "tag": {
                        "id": entry.tag.id,
                        "name": entry.tag.name
                    }
                } for entry in user.entries
            ]
            })

    return jsonify(user_list)

# ---> Adding a new user
@user_bp.route("/users", methods=["POST"])
def add_users():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = generate_password_hash(data['password'])

    # ---> Checking if the user already exists in the database
    check_name = User.query.filter_by(name=name).first()
    check_email = User.query.filter_by(email=email).first()

    print("Email ",check_email)
    print("Username",check_name)

    if check_name or check_email:
        return jsonify({"error":"Username/email exists"}),406

    # ---> If they don't exist, it will create a new user
    else:
        new_user = User(name=name, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
    
        return jsonify({"success":"Added successfully"}), 201

# ---> Updating a user by using their id
@user_bp.route("/users/<int:user_id>", methods=["PATCH"])
def update_users(user_id):
    #---> Fetch the user by their id so that we can update the specific user
    user = User.query.get(user_id)

    if user:
        data = request.get_json()
        name = data.get('name', user.name)
        email = data.get('email', user.email)
        password = data.get('password')

        # ---> Check if the new name or email already exists, but exclude the current user
        check_name = User.query.filter(User.name == name, User.id != user_id).first()
        check_email = User.query.filter(User.email == email, User.id != user_id).first()

        if check_name or check_email:
            return jsonify({"error": "Username/email exists"}), 406
        else:
            user.name = name
            user.email = email
            
            # ---> Option to update the password
            if password:
                user.password = generate_password_hash(password)  
            db.session.commit()
            return jsonify({"success": "Updated successfully"}), 201
    else:
        return jsonify({"error": "User doesn't exist!"}), 406


# ---> Delete a user
@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_users(user_id):
    user = User.query.get(user_id)

    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"success":"Deleted successfully"}), 200

    else:
        return jsonify({"error":"User your are trying to delete doesn't exist!"}),406