from flask import jsonify, request, Blueprint
from models import db, User, Tags, Entry
from datetime import datetime, timezone
from flask_jwt_extended import jwt_required, get_jwt_identity

entry_bp = Blueprint("entry_bp", __name__)

# ---> Fetch all entries
@entry_bp.route("/entries", methods=["GET"])
@jwt_required()
def fetch_products():
    current_user_id = get_jwt_identity()
    entries = Entry.query.filter_by(user_id=current_user_id)

    entry_list = []
    for entry in entries:
        entry_data = {
            'id': entry.id,
            'title': entry.title,
            'content': entry.content,
            'date_created': entry.date_created,
            'date_updated': entry.date_updated,
            "user": {"id": entry.user.id, "name": entry.user.name, "email": entry.user.email}
        }
        if entry.tag:  # Only include tag if it exists
            entry_data["tag"] = {"id": entry.tag.id, "name": entry.tag.name}
        entry_list.append(entry_data)
    
    return jsonify(entry_list)

# ---> Add an entry (now with optional tag)
@entry_bp.route("/entry/add", methods=["POST"])
@jwt_required()
def add_entry():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    title = data["title"]
    content = data['content']
    # -----> make it optional
    tag_id = data.get('tag_id')  

    # ----> Check if entry title exists
    if Entry.query.filter_by(title=title, user_id=current_user_id).first():
        return jsonify({"error": "Entry title already exists"}), 400

    # ----> Create entry 
    new_entry = Entry(
        title=title,
        content=content,
        user_id=current_user_id,
        tag_id=tag_id if tag_id else None
    )
    
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({"success": "Entry added successfully"}), 201

# ---> GET entry BY ID
@entry_bp.route("/entry/<int:entry_id>", methods=["GET"])
@jwt_required()
def get_entry(entry_id):
    current_user_id = get_jwt_identity()
    entry = Entry.query.filter_by(id=entry_id, user_id=current_user_id).first()

    if not entry:
        return jsonify({"error": "Entry not found"}), 404

    response = {
        "id": entry.id,
        "title": entry.title,
        "content": entry.content,
        "user_id": entry.user_id
    }
    
    if entry.tag:
        response["tag_id"] = entry.tag_id
        response["tag_name"] = entry.tag.name
        
    return jsonify(response), 200

# ---> Update an entry 
@entry_bp.route("/entry/<int:entry_id>", methods=["PATCH"])
@jwt_required()
def update_entry(entry_id):
    current_user_id = get_jwt_identity()
    entry = Entry.query.get(entry_id)

    if not entry:
        return jsonify({"error": "Entry doesn't exist!"}), 404

    if entry.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    title = data.get('title', entry.title)
    content = data.get('content', entry.content)
    tag_id = data.get('tag_id', entry.tag_id)  

    # ------> Check for duplicate title 
    if Entry.query.filter(Entry.title == title, Entry.id != entry_id, Entry.user_id == current_user_id).first():
        return jsonify({"error": "Title already exists"}), 400

    entry.title = title
    entry.content = content
    entry.tag_id = tag_id if tag_id else None
    entry.date_updated = datetime.now(timezone.utc)

    db.session.commit()
    return jsonify({"success": "Entry updated"}), 200

# ---> Delete an entry 
@entry_bp.route("/entry/<int:entry_id>", methods=["DELETE"])
@jwt_required()
def delete_entry(entry_id):
    current_user_id = get_jwt_identity()
    entry = Entry.query.filter_by(id=entry_id, user_id=current_user_id).first()

    if not entry:
        return jsonify({"error": "Entry not found"}), 404
        
    db.session.delete(entry)
    db.session.commit()
    return jsonify({"success": "Entry deleted"}), 200