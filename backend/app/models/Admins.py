from sqlalchemy import Column, Integer, String
from ..database import Base  # Import Base from database.py

class Admin(Base):  # Inherit from Flask-SQLAlchemy's Base
    __tablename__ = 'admins'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)

    def set_password(self, password):
        self.password = password  # Add hashing logic here if needed

    def check_password(self, password):
        return self.password == password  # Add hashing comparison here if needed

    def __repr__(self):
        return f"<Admin(username={self.username}, email={self.email})>"
