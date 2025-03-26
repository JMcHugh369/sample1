import random
import string
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from ..database import Base

# Association table for many-to-many relationship between campaigns and players
campaign_players = Table(
    'campaign_players',
    Base.metadata,
    Column('campaign_id', Integer, ForeignKey('campaigns.id'), primary_key=True),
    Column('player_id', Integer, ForeignKey('users.id'), primary_key=True)
)

class Campaign(Base):  # Inherit from Flask-SQLAlchemy's Base
    __tablename__ = 'campaigns'

    id = Column(Integer, primary_key=True, autoincrement=True)  # Campaign ID
    name = Column(String, unique=True, nullable=False)  # Campaign name (unique constraint added)
    dm_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # DM ID (references User ID)
    access_code = Column(String, unique=True, nullable=False)  # Unique access code for joining the campaign
    dm = relationship('User', back_populates='dm_campaigns')  # Relationship with User as DM
    players = relationship('User', secondary=campaign_players, back_populates='player_campaigns')  # Many-to-many relationship with players

    def __init__(self, name, dm_id):
        self.name = name
        self.dm_id = dm_id
        self.access_code = self.generate_access_code()  # Generate a random access code

    @staticmethod
    def generate_access_code(length=8):
        """Generate a random alphanumeric access code."""
        characters = string.ascii_letters + string.digits
        return ''.join(random.choices(characters, k=length))

    def __repr__(self):
        return f"<Campaign(name={self.name}, dm_id={self.dm_id}, access_code={self.access_code})>"
