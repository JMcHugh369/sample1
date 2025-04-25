'''
Autor: Joscelyn

This document contains the models or classes for this application

Contents:
    - User
    - Admin
    - DM
    - Species
    - Languages
    - Classes
    - Backgrounds
    - Stats
    - Saves
    - Proficiencies
    - Actions
    - Items
    - Characters
    - Character_Languages
    - Special_Languages
    - Player
    - Campaign
    - NPC
    - NPC_items
    - Monster
    - Monster_actions
    - Base_Items
    - Attacks
    - Armor
    - Weapons
    - Spells
    
These (above) are listed respectively

'''

from app.database import db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.mutable import MutableList


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    discord = db.Column(db.String(64), nullable=True)
    image_url = db.Column(db.String(255), nullable=True)  # New attribute

    def set_password(self, password):
        self.password = password

    def check_password(self, password):
        return self.password == password

class Admin(db.Model):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    
    def set_password(self, password):
        self.password = password
    
    def check_password(self, password):
        return self.password == password
    
    def __repr__(self):
        return f'<Admin {self.username}>'
    
class DM(db.Model):
    __tablename__ = 'dms'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def __repr__(self):
        return f'<DM {self.id}>'
    
    
class Species(db.Model):
    __tablename__ = 'species'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    
    size = db.Column(db.String(10), nullable=False)
    base_speed = db.Column(db.Integer, nullable=False)
    
    language_id = db.Column(db.Integer, db.ForeignKey('languages.id'), nullable=False)
    
    special_traits = db.Column(db.String(200), nullable=True)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Species {self.name}>'
    
    
class Languages(db.Model):
    __tablename__ = 'languages'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    
    script = db.Column(db.String(50), nullable=False)
    typical_speakers = db.Column(db.String(100), nullable=False) # e.g., "Elves, Humans"
    
    is_common = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Language {self.name}>'
    

class Classes(db.Model):
    __tablename__ = 'classes'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    class_index = db.Column(db.String(100), nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=False)
    hit_die = db.Column(db.Integer, nullable=False)
    proficiencies = db.Column(db.JSON, nullable=True)
    saving_throws = db.Column(db.JSON, nullable=True)
    subclasses = db.Column(db.JSON, nullable=True)
    spellcasting = db.Column(db.JSON, nullable=True)
    url = db.Column(db.String(500), nullable=True)
    
    def __repr__(self):
        return f'<Class {self.name}>'
    

class Backgrounds(db.Model):
    __tablename__ = 'backgrounds'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    
    skills_profs = db.Column(db.String(100), nullable=False) # e.g., "History, Insight"
    tool_profs = db.Column(db.String(100), nullable=True) # e.g., "Musical Instrument"
    languages = db.Column(db.String(100), nullable=True) # e.g., "Common, Elvish"
    background_feature = db.Column(db.String(200), nullable=True) # e.g., "Feature Description"
    
    equipment = db.Column(db.String(200), nullable=True) # e.g., "Equipment List"
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Background {self.name}>'
    

class Stats(db.Model):
    __tablename__ = 'stats'
    
    id = db.Column(db.Integer, primary_key=True)
    
    strength = db.Column(db.Integer, nullable=False)
    dexterity = db.Column(db.Integer, nullable=False)
    constitution = db.Column(db.Integer, nullable=False)
    intelligence = db.Column(db.Integer, nullable=False)
    wisdom = db.Column(db.Integer, nullable=False)
    charisma = db.Column(db.Integer, nullable=False)
    
    walk_speed = db.Column(db.Integer, nullable=False)
    inspiration = db.Column(db.Boolean, nullable=False)
    current_hp = db.Column(db.Integer, nullable=False)
    max_hp = db.Column(db.Integer, nullable=False)
    temp_hp = db.Column(db.Integer, nullable=False)
    defense = db.Column(db.Integer, nullable=False)
    conditions = db.Column(db.String(100), nullable=True) # e.g., "Blinded, Charmed"
    
    armor_class = db.Column(db.Integer, nullable=False)
    initiative = db.Column(db.Integer, nullable=False)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Stats>'
    

class Saves(db.Model):
    __tablename__ = 'saves'
    
    id = db.Column(db.Integer, primary_key=True)
    
    strength_save = db.Column(db.Integer, nullable=False)
    dexterity_save = db.Column(db.Integer, nullable=False)
    constitution_save = db.Column(db.Integer, nullable=False)
    intelligence_save = db.Column(db.Integer, nullable=False)
    wisdom_save = db.Column(db.Integer, nullable=False)
    charisma_save = db.Column(db.Integer, nullable=False)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Saves>'
    
    
class Action(db.Model):
    __tablename__ = 'actions'

    id = db.Column(db.Integer, primary_key=True)
    character_id = db.Column(db.Integer, db.ForeignKey('characters.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "character_id": self.character_id,
            "name": self.name,
            "description": self.description,
        }
    
    
class Items(db.Model):
    __tablename__ = 'items'
    
    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(100), nullable=False)
    
    item_type = db.Column(db.String(50), nullable=False) # e.g., "Weapon, Armor, Tool"
    cost = db.Column(db.Float, nullable=False) # Cost as a float with two decimal points
    weight = db.Column(db.Float, nullable=True) # Weight in pounds
    description = db.Column(db.String(200), nullable=True)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Item {self.item_name}>'
    
    
class Character(db.Model):
    __tablename__ = 'characters'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    size = db.Column(db.String(20), nullable=False)
    alignment = db.Column(db.String(50), nullable=False)
    passive_perception = db.Column(db.Integer, nullable=False, default=10)
    character_class = db.Column(db.String(50), nullable=False)
    proficiency_bonus = db.Column(db.Integer, nullable=False, default=2)
    no_hit_dice = db.Column(db.Integer, nullable=False, default=1)
    per_level = db.Column(db.Integer, nullable=False, default=1)
    species = db.Column(db.String(50), nullable=False)
    background = db.Column(db.String(100), nullable=True)
    level = db.Column(db.Integer, nullable=False, default=1)
    strength = db.Column(db.Integer, nullable=False, default=10)
    dexterity = db.Column(db.Integer, nullable=False, default=10)
    constitution = db.Column(db.Integer, nullable=False, default=10)
    intelligence = db.Column(db.Integer, nullable=False, default=10)
    wisdom = db.Column(db.Integer, nullable=False, default=10)
    charisma = db.Column(db.Integer, nullable=False, default=10)
    armor_class = db.Column(db.Integer, nullable=False, default=10)
    initiative = db.Column(db.Integer, nullable=False, default=0)
    speed = db.Column(db.Integer, nullable=False, default=30)
    hit_points = db.Column(db.Integer, nullable=False, default=10)
    image_url = db.Column(db.String(255), nullable=True)
    platinum_coins = db.Column(db.Integer, nullable=False, default=0)  # Already existing
    gold_coins = db.Column(db.Integer, nullable=False, default=0)      # Already existing
    electrum = db.Column(db.Integer, nullable=False, default=0)  # Add electrum here
    silver_coins = db.Column(db.Integer, nullable=False, default=0)    # Already existing
    copper_coins = db.Column(db.Integer, nullable=False, default=0) 
    current_hp = db.Column(db.Integer, default=0)
    max_hp = db.Column(db.Integer, default=0)
    conditions = db.Column(db.String(255), default="")
    defenses = db.Column(db.String(255), default="") 

    # Calculated properties for ability score modifiers
    @property
    def str_mod(self):
        return (self.strength - 10) // 2

    @property
    def dex_mod(self):
        return (self.dexterity - 10) // 2

    @property
    def con_mod(self):
        return (self.constitution - 10) // 2

    @property
    def int_mod(self):
        return (self.intelligence - 10) // 2

    @property
    def wis_mod(self):
        return (self.wisdom - 10) // 2

    @property
    def cha_mod(self):
        return (self.charisma - 10) // 2

    def __repr__(self):
        return f'<Character {self.name}>'

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "character_class": self.character_class,
            "species": self.species,
            "background": self.background,
            "level": self.level,
            "size": self.size,
            "alignment": self.alignment,
            "proficiency_bonus": self.proficiency_bonus,
            "no_hit_dice": self.no_hit_dice,
            "per_level": self.per_level,
            "strength": self.strength,
            "dexterity": self.dexterity,
            "constitution": self.constitution,
            "intelligence": self.intelligence,
            "wisdom": self.wisdom,
            "charisma": self.charisma,
            "armor_class": self.armor_class,
            "initiative": self.initiative,
            "speed": self.speed,
            "hit_points": self.hit_points,
            "platinum_coins": self.platinum_coins,
            "gold_coins": self.gold_coins,
            "electrum": self.electrum,
            "silver_coins": self.silver_coins,
            "copper_coins": self.copper_coins,
            "image_url": self.image_url,
        }
    
    
class Character_Languages(db.Model):
    __tablename__ = 'character_languages'
    
    character_id = db.Column(db.Integer, db.ForeignKey('characters.id'), primary_key=True)
    language_id = db.Column(db.Integer, db.ForeignKey('languages.id'), primary_key=True)
    
    fluency = db.Column(db.String(50), nullable=True)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Character_Language {self.character_id} - {self.language_id}>'
    
    
class Species_Language(db.Model):
    species_id = db.Column(db.Integer, db.ForeignKey('species.id'), primary_key=True)
    language_id = db.Column(db.Integer, db.ForeignKey('languages.id'), primary_key=True)
    
    def __repr__(self):
        return f'<Species_Language {self.species_id} - {self.language_id}>'


class Player(db.Model):
    __tablename__ = 'players'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    character_id = db.Column(db.Integer, db.ForeignKey('characters.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Player {self.user_id} - {self.character_id}>'
    
    
class Campaign(db.Model):
    __tablename__ = 'campaigns'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    access_code = db.Column(db.String(8), unique=True, nullable=False)  # Use access_code
    dm_id = db.Column(db.Integer, nullable=False)
    player_ids = db.Column(MutableList.as_mutable(ARRAY(db.Integer)), nullable=True, default=[])  # Array of player IDs

    def __repr__(self):
        return f'<Campaign {self.name}>'
    
    
class NPC(db.Model):
    __tablename__ = 'npcs'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    role = db.Column(db.String(50), nullable=False) # e.g., "Merchant, Guard"
    description = db.Column(db.String(200), nullable=True)
    dialogue = db.Column(db.String(200), nullable=True)
    alignment = db.Column(db.String(50), nullable=True) # e.g., "Neutral Good"
    level = db.Column(db.Integer, nullable=False, default=1)
    
    stats_id = db.Column(db.Integer, db.ForeignKey('stats.id'), nullable=False)
    saves_id = db.Column(db.Integer, db.ForeignKey('saves.id'), nullable=False)
    
    faction = db.Column(db.String(100), nullable=True) # e.g., "Thieves Guild"
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<NPC {self.name}>'
    
    
class NPC_items(db.Model):
    __tablename__ = 'npc_items'
    
    npc_id = db.Column(db.Integer, db.ForeignKey('npcs.id'), primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<NPC_Item {self.npc_id} - {self.item_id}>'
    
    
class Monster(db.Model):
    __tablename__ = 'monsters'

    id = db.Column(db.Integer, primary_key=True)
    monster_index = db.Column(db.String(100), nullable=False, unique=True)  # Renamed from 'index'
    name = db.Column(db.String(100), nullable=False)
    size = db.Column(db.String(10), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    alignment = db.Column(db.String(50), nullable=True)
    armor_class = db.Column(db.JSON, nullable=False)  # JSON to store armor class details
    hit_points = db.Column(db.Integer, nullable=False)
    hit_dice = db.Column(db.String(20), nullable=False)
    hit_points_roll = db.Column(db.String(20), nullable=True)
    speed = db.Column(db.JSON, nullable=False)  # JSON to store multiple speeds (e.g., walk, fly, swim)
    strength = db.Column(db.Integer, nullable=False)
    dexterity = db.Column(db.Integer, nullable=False)
    constitution = db.Column(db.Integer, nullable=False)
    intelligence = db.Column(db.Integer, nullable=False)
    wisdom = db.Column(db.Integer, nullable=False)
    charisma = db.Column(db.Integer, nullable=False)
    damage_vulnerabilities = db.Column(db.String(200), nullable=True)  # Comma-separated values
    damage_resistances = db.Column(db.String(200), nullable=True)  # Comma-separated values
    damage_immunities = db.Column(db.String(200), nullable=True)  # Comma-separated values
    condition_immunities = db.Column(db.String(200), nullable=True)  # Comma-separated values
    senses = db.Column(db.JSON, nullable=True)  # JSON to store senses like blindsight, darkvision
    passive_perception = db.Column(db.Integer, nullable=True)
    languages = db.Column(db.String(200), nullable=True)
    challenge_rating = db.Column(db.Float, nullable=False)
    prof_bonus = db.Column(db.Integer, nullable=False)
    xp = db.Column(db.Integer, nullable=False)
    special_abilities = db.Column(db.JSON, nullable=True)  # JSON to store special abilities
    actions = db.Column(db.JSON, nullable=True)  # JSON to store actions
    legendary_actions = db.Column(db.JSON, nullable=True)  # JSON to store legendary actions
    image_url = db.Column(db.String(200), nullable=True)
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __repr__(self):
        return f'<Monster {self.name}>'
    
    
class Monster_actions(db.Model):
    __tablename__ = 'monster_actions'
    
    monster_id = db.Column(db.Integer, db.ForeignKey('monsters.id'), primary_key=True)
    action_id = db.Column(db.Integer, db.ForeignKey('actions.id'), primary_key=True)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Monster_Action {self.monster_id} - {self.action_id}>'
    
    
class Base_Items(db.Model):
    __tablename__ = 'base_items'
    
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    cost = db.Column(db.Float, nullable=False)
    weight = db.Column(db.Float, nullable=True)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Base_Item {self.name}>'
    
    

class Attacks(db.Model):
    __tablename__ = 'attacks'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    damage_type = db.Column(db.String(50), nullable=False)
    damage_dice = db.Column(db.String(10), nullable=False) # e.g., "1d6"
    category = db.Column(db.String(50), nullable=False) # e.g., "Melee, Ranged"
    range = db.Column(db.String(50), nullable=True) # e.g., "Melee, 30 ft."
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Attack {self.name}>'
    
    
class Armor(db.Model):
    __tablename__ = 'armors'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    armor_class = db.Column(db.Integer, nullable=False)
    stealth_disadvantage = db.Column(db.Boolean, nullable=False, default=False)
    weight = db.Column(db.Float, nullable=True)
    cost = db.Column(db.Float, nullable=False)
    ac = db.Column(db.Integer, nullable=False)
    dex_bonus = db.Column(db.Integer, nullable=True)
    strength_bonus = db.Column(db.Integer, nullable=True)
    category = db.Column(db.String(50), nullable=False) # e.g., "Light, Medium, Heavy"
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Armor {self.name}>'
    
    
class Weapons(db.Model):
    __tablename__ = 'weapons'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    damage_type = db.Column(db.String(50), nullable=False)
    damage_dice = db.Column(db.String(10), nullable=False) # e.g., "1d8"
    category = db.Column(db.String(50), nullable=False) # e.g., "Simple, Martial"
    range = db.Column(db.String(50), nullable=True) # e.g., "Melee, 30 ft."
    weight = db.Column(db.Float, nullable=True)
    cost = db.Column(db.Float, nullable=False)
    properties = db.Column(db.String(100), nullable=True) # e.g., "Finesse, Versatile"
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Weapon {self.name}>'
    
    
class Spell(db.Model):
    __tablename__ = 'spells'

    id = db.Column(db.Integer, primary_key=True)
    character_id = db.Column(db.Integer, db.ForeignKey('characters.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "character_id": self.character_id,
            "name": self.name,
            "description": self.description,
        }

class Feature(db.Model):
    __tablename__ = 'features'
    id = db.Column(db.Integer, primary_key=True)
    character_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "character_id": self.character_id,
            "name": self.name,
            "description": self.description,
        }
    
    
class Proficiency(db.Model):
    __tablename__ = 'proficiencies'

    id = db.Column(db.Integer, primary_key=True)
    character_id = db.Column(db.Integer, db.ForeignKey('characters.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "character_id": self.character_id,
            "name": self.name,
            "description": self.description,
        }

class Other(db.Model):
    __tablename__ = 'others'
    id = db.Column(db.Integer, primary_key=True)
    character_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)

class Inventory(db.Model):
    __tablename__ = 'inventory'
    id = db.Column(db.Integer, primary_key=True)
    character_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "character_id": self.character_id,
            "name": self.name,
            "description": self.description,
        }

class CharacterFeature(db.Model):
    __tablename__ = "character_features"
    id = db.Column(db.Integer, primary_key=True)
    character_id = db.Column(db.Integer, db.ForeignKey("character.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)

class CharacterBackground(db.Model):
    __tablename__ = "character_backgrounds"
    id = db.Column(db.Integer, primary_key=True)
    character_id = db.Column(db.Integer, db.ForeignKey("character.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)

class CharacterExtra(db.Model):
    __tablename__ = "character_extras"
    id = db.Column(db.Integer, primary_key=True)
    character_id = db.Column(db.Integer, db.ForeignKey("character.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)