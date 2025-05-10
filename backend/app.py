from flask import Flask
from flask_migrate import Migrate
from models import db, TokenBlocklist
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///journal.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://online_journaldb_user:OwpfjfMuA4eD3SYAzBOMPE6nQJwBApNk@dpg-d0fh4gk9c44c73bc4jkg-a.oregon-postgres.render.com/online_journaldb'

migrate = Migrate(app, db)
db.init_app(app)

# ---> JWT 
app.config["JWT_SECRET_KEY"] = "journaljournal"
# ---> This is to create a token for authentication to be used while login in.
app.config["JWT_ACCESS_TOKEN_EXPIRE"] = timedelta(hours=1)
jwt = JWTManager(app)

# ---> Initializing
jwt.init_app(app)

from views import *

app.register_blueprint(user_bp)
app.register_blueprint(entry_bp)
app.register_blueprint(tags_bp)
app.register_blueprint(auth_bp)

# ---> JWT Blocklist callback function
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None

if __name__ == '__main__':
    app.run("localhost", debug=True)