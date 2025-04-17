from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail
from models import db

bcrypt = Bcrypt()
jwt = JWTManager()
mail = Mail()  # Initialize mail object here

def create_app():
    app = Flask(__name__ , static_folder='static')
    
    # ✅ Properly configure CORS
    CORS(app, origins="http://localhost:3000", supports_credentials=True)

    # ✅ Flask Configurations
    app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql+psycopg2://postgres:12345678@localhost:5432/hello_deepak'
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "1234erdjhmfd7676r"
    app.config["BCRYPT_LOG_ROUNDS"] = 12  

    # ✅ Flask-Mail Configuration
    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_TLS"] = True
    app.config['MAIL_USERNAME'] = 'dkdps3212@gmail.com'
    app.config['MAIL_PASSWORD'] = 'xxlbkjaecnbhsqra'
    #app.config["MAIL_DEFAULT_SENDER"] = "your_email@gmail.com"

    # ✅ Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)  
    mail.init_app(app)  # Initialize Flask-Mail

    # ✅ Register Blueprints
    from routes.auth import auth
    app.register_blueprint(auth)
    from routes.user import user
    app.register_blueprint(user)
    from routes.file import file
    app.register_blueprint(file)
    @app.route('/static/<path:filename>')
    def static_files(filename):
        return send_from_directory(app.static_folder, filename)

    # ✅ Create tables within the application context
    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
