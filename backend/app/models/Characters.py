from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base  # Import Base from database.py

class Character(Base):  # Inherit from Flask-SQLAlchemy's Base
    __tablename__ = 'characters'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Foreign key to users table
    user = relationship('User', back_populates='characters')  # Define relationship with User model

    name = Column(String, nullable=False)
    race = Column(String, nullable=False)
    character_class = Column(String, nullable=False)  # 'class' is a reserved keyword
    level = Column(Integer, nullable=False, default=1)
    background = Column(String, nullable=True)
    alignment = Column(String, nullable=True)

    # Ability scores
    strength = Column(Integer, nullable=False, default=10)
    dexterity = Column(Integer, nullable=False, default=10)
    constitution = Column(Integer, nullable=False, default=10)
    intelligence = Column(Integer, nullable=False, default=10)
    wisdom = Column(Integer, nullable=False, default=10)
    charisma = Column(Integer, nullable=False, default=10)

    # Additional attributes
    armor_class = Column(Integer, nullable=False, default=10)
    hit_points = Column(Integer, nullable=False, default=10)
    speed = Column(Integer, nullable=False, default=30)
    proficiency_bonus = Column(Integer, nullable=False, default=2)

    # Skills and saving throws
    skills = Column(Text, nullable=True)  # Store skill proficiencies as a comma-separated string
    saving_throws = Column(Text, nullable=True)  # Store saving throw proficiencies as a comma-separated string

    # Equipment and features
    equipment = Column(Text, nullable=True)  # Store equipment details as a comma-separated string
    features = Column(Text, nullable=True)  # Store class/race features as a comma-separated string

    # Spells
    spells = Column(Text, nullable=True)  # Store spell details as a comma-separated string

    # Miscellaneous
    languages = Column(Text, nullable=True)  # Store known languages as a comma-separated string
    notes = Column(String, nullable=True)  # Additional notes about the character

    # Currency
    copper_coins = Column(Integer, nullable=False, default=0)
    silver_coins = Column(Integer, nullable=False, default=0)
    gold_coins = Column(Integer, nullable=False, default=0)
    platinum_coins = Column(Integer, nullable=False, default=0)

    # Inventory and weight
    inventory = Column(Text, nullable=True)  # Store inventory items as a comma-separated string
    total_weight = Column(Float, nullable=False, default=0.0)

    def __repr__(self):
        return f"<Character(name={self.name}, race={self.race}, class={self.character_class}, level={self.level})>"
