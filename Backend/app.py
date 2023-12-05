from flask import jsonify, request, Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from faker import Faker
from sqlalchemy import func

fake = Faker()
from datetime import datetime, timedelta
import random
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# This is the database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///homeCatalog.db"
app.config["SECRET_KEY"] = "mysecret"
db = SQLAlchemy(app)


# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    user_type = db.Column(db.String(50), nullable=False)
    # relationships

    reviews = db.relationship("Review", backref="user", lazy=True)
    user_views = db.relationship("UserViewsHome", backref="user", lazy=True)
    user_agents = db.relationship("UserInteractsWithAgent", backref="user", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            # Include any other fields that should be serialized
            # Do not include sensitive information like passwords
        }

    def update_from_dict(self, data):
        for key in data:
            if hasattr(self, key) and key != "id":
                setattr(self, key, data[key])


class Agent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_number = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    # relatonships
    agent_homes = db.relationship("AgentRepresentsHome", backref="agent", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "contact_number": self.contact_number,
            "email": self.email,
            "user_id": self.user_id
            # Add other fields that you want to include in the JSON representation
        }

    def from_dict(data):
        return Agent(
            name=data.get("name"),
            contact_number=data.get("contact_number"),
            email=data.get("email"),
            # Map other fields from data to model fields
        )

    def update_from_dict(self, data):
        for field in ["name", "contact_number", "email"]:
            if field in data:
                setattr(self, field, data[field])
        # Update other fields as necessary


class Home(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    square_feet = db.Column(db.Integer, nullable=False)
    bedrooms = db.Column(db.Integer, nullable=False)
    bathrooms = db.Column(db.Integer, nullable=False)
    availability_status = db.Column(db.String(50), nullable=False)
    area_id = db.Column(db.Integer, db.ForeignKey("area.id"), nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    imageURL = db.Column(db.String(200), nullable=False)
    # Relationships
    reviews = db.relationship("Review", backref="home", lazy=True)
    views = db.relationship("UserViewsHome", backref="home", lazy=True)
    agents = db.relationship("AgentRepresentsHome", backref="home", lazy=True)
    specifications = db.relationship("HomeHasSpecification", backref="home", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "address": self.address,
            "price": self.price,
            "square_feet": self.square_feet,
            "bedrooms": self.bedrooms,
            "bathrooms": self.bathrooms,
            "availability_status": self.availability_status,
            "area_id": self.area_id,
            "longitude": self.longitude,  # Add longitude
            "latitude": self.latitude,  # Add latitude
            "imageURL": self.imageURL,  # Add image URL if needed
        }

    def from_dict(data):
        return Home(
            address=data.get("address"),
            price=data.get("price"),
            square_feet=data.get("square_feet"),
            bedrooms=data.get("bedrooms"),
            bathrooms=data.get("bathrooms"),
            availability_status=data.get("availability_status"),
            area_id=data.get("area_id"),
            latitude=data.get("latitude"),
            longitude=data.get("longitude"),
            imageURL=data.get("imageURL"),
            # Map other fields from data to model fields as needed
        )

    def update_from_dict(self, data):
        for field in [
            "address",
            "price",
            "square_feet",
            "bedrooms",
            "bathrooms",
            "availability_status",
            "area_id",
        ]:
            if field in data:
                setattr(self, field, data[field])
        # Update other fields as necessary


class Area(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    zip_code = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    # relationships
    homes = db.relationship("Home", backref="area", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "zip_code": self.zip_code,
            "city": self.city,
            "state": self.state,
        }


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(300), nullable=True)
    home_id = db.Column(db.Integer, db.ForeignKey("home.id"), nullable=False)


class UserViewsHome(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    view_date = db.Column(db.DateTime, default=datetime.utcnow)
    home_id = db.Column(db.Integer, db.ForeignKey("home.id"), nullable=False)


class UserInteractsWithAgent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    interaction_date = db.Column(db.DateTime, default=datetime.utcnow)
    message = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    agent_id = db.Column(db.Integer, db.ForeignKey("agent.id"), nullable=False)
    Sender = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "interaction_date": self.interaction_date.isoformat(),  # Format datetime to string
            "message": self.message,
            "user_id": self.user_id,
            "agent_id": self.agent_id,
            "Sender": self.Sender,
        }


class AgentRepresentsHome(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    agent_id = db.Column(db.Integer, db.ForeignKey("agent.id"), nullable=False)
    home_id = db.Column(
        db.Integer, db.ForeignKey("home.id", ondelete="CASCADE"), nullable=False
    )
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=True)


class HomeHasSpecification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    home_id = db.Column(db.Integer, db.ForeignKey("home.id"), nullable=False)
    spec_id = db.Column(db.Integer, db.ForeignKey("specification.id"), nullable=False)


class Specification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    spec_type = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    # relationships
    homes = db.relationship("HomeHasSpecification", backref="specification", lazy=True)


class SavedHome(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    home_id = db.Column(db.Integer, db.ForeignKey("home.id"), nullable=False)
    date_saved = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="saved_homes")
    home = db.relationship("Home", backref="saved_by_users")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "home_id": self.home_id,
            "date_saved": self.date_saved.isoformat(),  # or format it as a string if necessary
            # Include other fields if necessary
        }


# Create the database tables
with app.app_context():
    db.create_all()

admin = Admin(app, name="Home Catalog Admin", template_mode="bootstrap3")

# Add administrative views here
from flask_admin.contrib.sqla import ModelView

admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(Agent, db.session))
admin.add_view(ModelView(Home, db.session))
admin.add_view(ModelView(Area, db.session))
admin.add_view(ModelView(Review, db.session))
admin.add_view(ModelView(UserViewsHome, db.session))
admin.add_view(ModelView(UserInteractsWithAgent, db.session))
admin.add_view(ModelView(AgentRepresentsHome, db.session))
admin.add_view(ModelView(HomeHasSpecification, db.session))
admin.add_view(ModelView(Specification, db.session))

# api Login for user admin and agent this code is used in login page


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    if user and check_password_hash(user.password, data["password"]):
        return (
            jsonify(
                {"user_type": user.user_type, "user_id": user.id, "name": user.name}
            ),
            200,
        )
    return (
        jsonify({"message": data}),
        401,
    )


@app.route("/")
def hello_world():
    return "Hello, World!"


# Register user API


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data["password"])
    new_user = User(
        name=data["name"],
        email=data["email"],
        password=hashed_password,
        user_type=data["user_type"],
    )
    db.session.add(new_user)

    try:
        db.session.commit()

        # Check if the user type is 'realtor' and add to Agent table
        if data["user_type"] == "realtor":
            new_agent = Agent(
                name=data["name"],
                contact_number="",  # You might want to add a field for this in your registration form
                email=data["email"],
                user_id=new_user.id,  # Link the new user's ID
            )
            db.session.add(new_agent)
            db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        db.session.rollback()  # Rollback in case of any error
        return jsonify({"message": "Registration failed", "error": str(e)}), 500


@app.route("/api/homes", methods=["POST"])
def create_home():
    data = request.get_json()
    new_home = Home.from_dict(data)
    db.session.add(new_home)
    db.session.commit()
    return jsonify(new_home.to_dict()), 201


@app.route("/api/homes", methods=["GET"])
def get_homes():
    homes = Home.query

    price_min = request.args.get("priceMin")
    price_max = request.args.get("priceMax")
    bedrooms = request.args.get("bedrooms")
    bathrooms = request.args.get("bathrooms")
    city = request.args.get("city")
    size = request.args.get("size")

    if price_min:
        homes = homes.filter(Home.price >= price_min)
    if price_max:
        homes = homes.filter(Home.price <= price_max)
    if bedrooms:
        homes = homes.filter(Home.bedrooms == bedrooms)
    if bathrooms:
        homes = homes.filter(Home.bathrooms == bathrooms)
    if city:
        filtered_homes = homes.join(Area).filter(Area.city.ilike(f"%{city}%"))
        if filtered_homes.count() == 0:
            # No homes found for the specified city
            return (
                jsonify({"message": "No homes found in this city", "city": city}),
                200,
            )
        else:
            homes = filtered_homes
    if size:
        homes = homes.filter(Home.square_feet >= size)

    homes = homes.all()
    serialized_homes = [home.to_dict() for home in homes]

    return jsonify(serialized_homes)


@app.route("/api/homes/<int:home_id>", methods=["GET", "PUT"])
def homes(home_id=None):
    if request.method == "GET":
        # If a specific home is requested, return its details
        if home_id:
            home = Home.query.get_or_404(home_id)
            return jsonify(home.to_dict())
        else:  # If no specific home is requested, return a list of all homes
            homes_list = Home.query.all()
            return jsonify([home.to_dict() for home in homes_list])

    elif request.method == "PUT":
        # Update an existing home
        home = Home.query.get_or_404(home_id)
        data = request.get_json()
        home.update_from_dict(
            data
        )  # Assuming a method that updates the instance from a dict
        db.session.commit()
        return jsonify(home.to_dict()), 200


@app.route("/api/homes/<int:home_id>", methods=["DELETE"])
def delete_home(home_id):
    # First, delete any entries in agent_represents_home
    AgentRepresentsHome.query.filter_by(home_id=home_id).delete()

    # Now, it's safe to delete the home
    home = Home.query.get_or_404(home_id)
    db.session.delete(home)

    # Commit the changes to the database
    db.session.commit()
    return (
        jsonify({"message": "Home and its representations deleted successfully."}),
        200,
    )


@app.route("/api/users", methods=["GET", "POST"])
@app.route("/api/users/<int:user_id>", methods=["GET", "PUT", "DELETE"])
def users(user_id=None):
    if request.method == "GET":
        if user_id:
            user = User.query.get_or_404(user_id)
            return jsonify(user.to_dict())
        else:
            users_list = User.query.all()
            return jsonify([user.to_dict() for user in users_list])

    elif request.method == "POST":
        data = request.get_json()
        new_user = User.from_dict(data)
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.to_dict()), 201

    elif request.method == "PUT":
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        user.update_from_dict(data)
        db.session.commit()
        return jsonify(user.to_dict()), 200

    elif request.method == "DELETE":
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully."}), 200


@app.route("/api/agent_represents_home/<int:home_id>", methods=["GET"])
def get_agent_for_home(home_id=None):
    # Query your 'agent_represents_home' table to find the agent_id for the given home_id
    representation = AgentRepresentsHome.query.filter_by(home_id=home_id).first()
    if representation:
        # Return the agent details
        agent = Agent.query.get(representation.agent_id)
        print("Agent!", agent)
        return jsonify(agent.to_dict())
    else:
        return jsonify({"error": "Agent not found"}), 404


@app.route("/api/agents", methods=["GET", "POST"])
@app.route("/api/agents/<int:agent_id>", methods=["GET", "PUT", "DELETE"])
def agents(agent_id=None):
    if request.method == "GET":
        if agent_id:
            agent = Agent.query.get_or_404(agent_id)
            return jsonify(agent.to_dict())
        else:
            agents_list = Agent.query.all()
            return jsonify([agent.to_dict() for agent in agents_list])

    elif request.method == "POST":
        data = request.get_json()
        new_agent = Agent.from_dict(data)
        db.session.add(new_agent)
        db.session.commit()
        return jsonify(new_agent.to_dict()), 201

    elif request.method == "PUT":
        agent = Agent.query.get_or_404(agent_id)
        data = request.get_json()
        agent.update_from_dict(data)
        db.session.commit()
        return jsonify(agent.to_dict()), 200

    elif request.method == "DELETE":
        agent = Agent.query.get_or_404(agent_id)
        db.session.delete(agent)
        db.session.commit()
        return jsonify({"message": "Agent deleted successfully."}), 200


@app.route("/api/users/<int:user_id>/save_home", methods=["POST"])
def save_home(user_id):
    data = request.get_json()
    home_id = data.get("home_id")
    if not home_id:
        return jsonify({"message": "Home ID is required."}), 400
    saved_home = SavedHome(user_id=user_id, home_id=home_id)
    db.session.add(saved_home)
    try:
        db.session.commit()
        return jsonify({"message": "Home saved successfully."}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Saving home failed.", "error": str(e)}), 500


@app.route("/api/send_message", methods=["POST"])
def send_message():
    data = request.get_json()
    message = UserInteractsWithAgent(
        user_id=data["user_id"],
        agent_id=data["agent_id"],
        message=data["message"],
        interaction_date=datetime.utcnow(),  # This sets the current time for the message
        Sender=data["Sender"],
    )
    db.session.add(message)
    try:
        db.session.commit()
        return (
            jsonify(
                {
                    "message": "Message sent successfully!",
                    "data": {
                        "id": message.id,  # Assuming your ORM provides the ID after commit
                        "message": message.message,
                        "Sender": message.Sender,
                        "interaction_date": message.interaction_date.isoformat(),  # Convert to string if necessary
                    },
                }
            ),
            201,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to send message", "details": str(e)}), 500


@app.route("/api/users/<int:user_id>/saved_homes", methods=["GET"])
def get_saved_homes(user_id):
    try:
        saved_homes = (
            SavedHome.query.filter_by(user_id=user_id)
            .join(Home, SavedHome.home_id == Home.id)
            .all()
        )
        return jsonify([home.to_dict() for home in saved_homes]), 200
    except Exception as e:
        return (
            jsonify({"error": "Failed to retrieve saved homes", "details": str(e)}),
            500,
        )


@app.route("/api/users/<int:user_id>/saved_homes/<int:home_id>", methods=["DELETE"])
def delete_saved_home(user_id, home_id):
    try:
        # Find the saved home entry
        saved_home = SavedHome.query.filter_by(user_id=user_id, home_id=home_id).first()
        if not saved_home:
            return jsonify({"message": "Saved home not found"}), 404

        # Delete the entry
        db.session.delete(saved_home)
        db.session.commit()

        return jsonify({"message": "Saved home deleted successfully."}), 200
    except Exception as e:
        # Handle exceptions
        db.session.rollback()
        return jsonify({"error": "Failed to delete saved home", "details": str(e)}), 500


@app.route("/api/users/<int:user_id>/messages", methods=["GET"])
def get_user_messages(user_id):
    try:
        messages = UserInteractsWithAgent.query.filter_by(user_id=user_id).all()
        return jsonify([message.to_dict() for message in messages]), 200
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


@app.route("/api/agents/<int:agent_id>/messages/users/<int:user_id>", methods=["GET"])
def get_messages_for_user(agent_id, user_id):
    try:
        # Fetch all interactions between the specific agent and user
        messages = UserInteractsWithAgent.query.filter_by(
            agent_id=agent_id, user_id=user_id
        ).all()

        # Serialize the messages
        messages_data = [message.to_dict() for message in messages]
        return jsonify(messages_data), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve messages", "details": str(e)}), 500


@app.route("/api/agents/<int:agent_id>/messages", methods=["GET"])
def get_agent_messages(agent_id):
    try:
        # Fetch all interactions where the current agent is involved
        messages = UserInteractsWithAgent.query.filter_by(agent_id=agent_id).all()
        return jsonify([message.to_dict() for message in messages]), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve messages", "message": str(e)}), 500


@app.route("/api/users/<int:user_id>/messages/agents/<int:agent_id>", methods=["GET"])
def get_messages_for_agent(user_id, agent_id):
    try:
        messages = UserInteractsWithAgent.query.filter_by(
            user_id=user_id, agent_id=agent_id
        ).all()
        return jsonify([message.to_dict() for message in messages]), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve messages", "details": str(e)}), 500


@app.route("/api/users/<int:user_id>/edit_profile", methods=["PUT"])
def edit_profile(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.update_from_dict(data)
    db.session.commit()
    return jsonify(user.to_dict()), 200


@app.route("/api/agent_represents_home", methods=["POST"])
def agent_represents_home():
    data = request.get_json()
    agent_id = data.get("agent_id")
    home_id = data.get("home_id")

    # Assuming you have a constructor for the AgentRepresentsHome model
    new_representation = AgentRepresentsHome(agent_id=agent_id, home_id=home_id)
    db.session.add(new_representation)
    try:
        db.session.commit()
        return jsonify({"message": "Representation added successfully."}), 201
    except Exception as e:
        db.session.rollback()
        return (
            jsonify({"error": "Failed to add representation", "details": str(e)}),
            500,
        )


@app.route("/api/agents/<int:agent_id>/homes", methods=["GET"])
def get_agent_homes(agent_id):
    representations = AgentRepresentsHome.query.filter_by(agent_id=agent_id).all()
    homes = [
        db.session.get(Home, representation.home_id).to_dict()
        for representation in representations
    ]
    return jsonify(homes), 200


@app.route("/api/agents/<int:agent_id>/edit_profile", methods=["PUT"])
def edit_agent_profile(agent_id):
    # Get the agent from the database
    agent = Agent.query.get_or_404(agent_id)

    # Get the data sent in the request
    data = request.get_json()

    # Update the agent's attributes
    if "name" in data:
        agent.name = data["name"]
    if "email" in data:
        agent.email = data["email"]
    if "contact_number" in data:
        agent.contact_number = data["contact_number"]

    # Try to commit the changes to the database
    try:
        db.session.commit()
        return jsonify(agent.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return (
            jsonify({"error": "Failed to update agent profile", "details": str(e)}),
            500,
        )


@app.route("/api/agents/user/<int:user_id>", methods=["GET"])
def get_agent_by_user(user_id):
    # Find the agent entry where user_id matches the provided user ID
    agent = Agent.query.filter_by(user_id=user_id).first()

    # If an agent is found, return the agent's details
    if agent:
        return jsonify(agent.to_dict()), 200
    else:
        # If no agent is found, return an error message
        return jsonify({"message": "No agent found for this user"}), 404


@app.route("/api/areas", methods=["POST"])
def add_area():
    data = request.get_json()
    new_area = Area(
        name=data["name"],
        city=data["city"],
        zip_code=data["zip_code"],
        state=data["state"],
    )
    db.session.add(new_area)
    try:
        db.session.commit()
        return jsonify(new_area.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to add area", "error": str(e)}), 500


@app.route("/api/areas", methods=["GET"])
def get_areas():
    try:
        areas = Area.query.all()
        return jsonify([area.to_dict() for area in areas]), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch areas", "details": str(e)}), 500


@app.route("/api/record_view", methods=["POST"])
def record_view():
    data = request.get_json()
    user_id = data.get("user_id")
    home_id = data.get("home_id")

    # Check if the view already exists
    existing_view = UserViewsHome.query.filter_by(
        user_id=user_id, home_id=home_id
    ).first()
    if existing_view:
        return jsonify({"message": "View already recorded"}), 200

    # Record a new view
    new_view = UserViewsHome(user_id=user_id, home_id=home_id)
    db.session.add(new_view)
    try:
        db.session.commit()
        return jsonify({"message": "View recorded successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to record view", "details": str(e)}), 500


@app.route("/api/homes/<int:home_id>/views", methods=["GET"])
def get_home_views(home_id):
    # Aggregate views by date
    view_counts = (
        db.session.query(
            func.date(UserViewsHome.view_date).label("date"),
            func.count("*").label("count"),
        )
        .filter(UserViewsHome.home_id == home_id)
        .group_by(func.date(UserViewsHome.view_date))
        .all()
    )

    # Format the results
    result = [{"date": view_date, "count": count} for view_date, count in view_counts]

    return jsonify(result)


@app.route("/api/homes/<int:home_id>/views_count", methods=["GET"])
def get_home_views_count(home_id):
    view_count = UserViewsHome.query.filter_by(home_id=home_id).count()
    return jsonify({"view_count": view_count})


if __name__ == "__main__":
    app.run(debug=True)
