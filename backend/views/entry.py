from flask import jsonify, request, Blueprint
from models import db, User, Tags, Entry
from datetime import datetime, timezone
from flask_jwt_extended import jwt_required, get_jwt_identity

entry_bp = Blueprint("entry_bp", __name__)

# ---> CREATING THE CRUD FUNCTIONS

# ---> Fetch all entries
@entry_bp.route("/entries", methods=["GET"])
@jwt_required()
def fetch_products(): 

    # ---> Fetching all tentries in the db

    current_user_id = get_jwt_identity()

    entries = Entry.query.filter_by(user_id = current_user_id)

    entry_list = []
    for entry in entries:
        entry_list.append({
            'id': entry.id,
            'title': entry.title,
            'content': entry.content,
            'date_created': entry.date_created,
            'date_updated': entry.date_updated,
            "user": {"id":entry.user.id, "name": entry.user.name, "email": entry.user.email},
            "tag": {"id": entry.tag.id, "name":entry.tag.name}
        })
    return jsonify(entry_list)

# ---> add an entry
@entry_bp.route("/entry/add", methods=["POST"])
@jwt_required()
def add_entry():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    title = data["title"]
    content = data['content']

    #---> added a user id because it wasn't working without it and it was saying NULL 
    tag_id = data.get('tag_id') 

    # ---> Check if the entry title already exists
    check_title = Entry.query.filter_by(title=title).first()
    check_tag_id = Tags.query.get(tag_id)

    if check_title:
        return jsonify({"error": "Entry already exists"}), 400
    
    if not check_tag_id:
        return jsonify({"error":"Tag/user doesn't exists"}),406
    
    # if not user_id:
    #     return jsonify({"error": "User ID is required"}), 400

    # ----> Create a new entry and associate it with the user
    new_entry = Entry(title=title, content=content, user_id=current_user_id, tag_id=tag_id)
    
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({"success": "Added successfully"}), 201

# ---> GET entry BY ID
@entry_bp.route("/entry/<int:entry_id>", methods=["GET"])
@jwt_required()
def get_entry(entry_id):
    current_user_id = get_jwt_identity()

    entry = Entry.query.filter_by(id=entry_id, user_id=current_user_id).first()
    if entry:
        entry_details = {
            "id": entry.id,
            "title": entry.title,
            "content": entry.content,
            "user_id": entry.user_id,
            "tag_id": entry.tag_id
        }
        return jsonify(entry_details), 200
    
    else:
        return jsonify({"error": "Entry not found"}), 406

# ---> Update an entry 
@entry_bp.route("/entry/<int:entry_id>", methods=["PATCH"])
@jwt_required()
def update_entry(entry_id):
    current_user_id = get_jwt_identity()

    data = request.get_json()
    entry = Entry.query.get(entry_id)

    # Check if the entry exists
    if entry is None:
        return jsonify({"error": "Entry doesn't exist!"}), 404

    # Check if the entry belongs to the current user
    if entry.user_id == current_user_id:
        return jsonify({"error": "You don't have permission to edit this entry"}), 403

    title = data.get('title', entry.title)
    content = data.get('content', entry.content)
    tag_id = data.get('tag_id', entry.tag_id)
    updated_at = datetime.now(timezone.utc)  # Force update

    # Check if the title already exists, excluding the current entry
    check_title = Entry.query.filter(Entry.title == title, Entry.id != entry_id).first()

    if check_title:
        return jsonify({"error": "Entry title already exists"}), 406

    # Update the entry
    entry.title = title
    entry.content = content
    entry.tag_id = tag_id
    entry.date_updated = updated_at

    db.session.commit()
    return jsonify({"success": "Updated successfully"}), 200



# ---> delete an entry
@entry_bp.route("/entry/<int:entry_id>", methods=["DELETE"])
@jwt_required()
def delete_entry(entry_id):
    current_user_id = get_jwt_identity()

    entry = Entry.query.filter_by(id=entry_id, user_id=current_user_id).first()

    if not entry:
        return jsonify({"error": "Entry not found"})
        
    db.session.delete(entry)
    db.session.commit()
    return jsonify({"success": "Deleted successfully"})
    
   

