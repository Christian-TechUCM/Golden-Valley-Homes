from app import app, db  # Make sure to import your Flask app and db from your main app module

with app.app_context():
    db.create_all()  # This will create all tables based on your models

print("Database tables created.")
