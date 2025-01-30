from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from datetime import datetime, timezone

metaData = MetaData()

db = SQLAlchemy(metadata=metaData)

# ---> CREATING THE USER TABLE
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(128), nullable=False, unique=True)
    password = db.Column(db.String(512), nullable=False)
    is_verified = db.Column(db.Boolean, default=False) 

    # Relationship with entries, sorted by date created

    entries = db.relationship("Entry", backref="user", cascade="all, delete", lazy=True, order_by="desc(Entry.date_created)")

# ---> CREATING THE TAG MODEL 
class Tags(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    user = db.relationship("User", backref="tags", lazy=True)
    entries = db.relationship("Entry", backref="tag", lazy=True) 

# ---> CREATING THE JOURNAL ENTRY MODEL
class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    date_updated = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Adding a foreign key to User
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    tag_id =  db.Column(db.Integer, db.ForeignKey("tags.id"), nullable=False)

# ---> ADDING A TOKEN BLOCKLIST WHEN A USER LOGS OUT
class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)


