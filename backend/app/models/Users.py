from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base  # Import Base from database.py

class User(Base):  # Inherit from Flask-SQLAlchemy's Base
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    discord = Column(String, nullable=True)

    characters = relationship('Character', back_populates='user')  # Define relationship with Character model
    dm_campaigns = relationship('Campaign', back_populates='dm')  # Campaigns where the user is the DM
    player_campaigns = relationship('Campaign', secondary='campaign_players', back_populates='players')  # Campaigns where the user is a player

    def __repr__(self):
        return f"<User(username={self.username}, email={self.email}, discord={self.discord})>"
