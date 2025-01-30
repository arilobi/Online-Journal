from flask import jsonify, request, Blueprint
from models import db, User, Tags

tags_bp = Blueprint("tags_bp", __name__)

# ------> ADD A TAG
@tags_bp.route("/tags", methods=["POST"])
def add_tag():
    data = request.get_json()
    name = data['name']
    user_id = data['user_id']

    # ---> Check if the combination of name and user_id already exists
    check_tag = Tags.query.filter_by(name=name, user_id=user_id).first()

    if check_tag:
        return jsonify({"error": "Tag with this name already exists for this user"}), 406

    else:
        new_tag = Tags(name=name, user_id=user_id)  
        db.session.add(new_tag)
        db.session.commit()
        return jsonify({"success": "Tag added successfully"}), 201

# ------> FETCH ALL TAGS
@tags_bp.route("/tags", methods=["GET"])
def get_all_tags():
    tags = Tags.query.all()
    tags_list = []

    for tag in tags:
        tags_list.append({
            "id": tag.id,
            "name": tag.name
        })
        
    return jsonify(tags_list), 200

# ------> UPDATE A TAG
@tags_bp.route("/tags/<int:tag_id>", methods=["PATCH"])
def update_tags(tag_id):
    tag = db.session.get(Tags, tag_id)

    if tag:
        data = request.get_json()
        name = data.get('name')

        if not name:
            return jsonify({"error": "Name is required"}), 400  # --->Ensuring that the name is provided

        # ---> Check if the name already exists for another tag (same name with a different ID)
        check_tag = Tags.query.filter(Tags.name == name, Tags.id != tag_id).first()

        if check_tag:
            return jsonify({"error": "Tag name already exists"}), 406

        # ---> Update the tag
        tag.name = name
        db.session.commit()
        return jsonify({"success": "Updated successfully"}), 200  # Changed to 200 for successful update

    else:
        return jsonify({"error": "Tag not found"}), 404

# ------> DELETE A TAG
@tags_bp.route("/tags/<int:tag_id>", methods=["DELETE"])
def delete_tags(tag_id):
    tag = Tags.query.get(tag_id)

    if tag:
        db.session.delete(tag)
        db.session.commit()
        return jsonify({"success": "Deleted successfully"}), 200  # ---> 200 status code means success
    
    else:
        return jsonify({"error": "Tag not found"}), 404  # ---> 404 status code to mean that a tag is not found
