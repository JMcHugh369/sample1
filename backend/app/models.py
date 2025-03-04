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

from .database import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    discord = db.Column(db.String(120), unique=True, nullable=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Admin(db.Model):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
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
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    
    hit_die = db.Column(db.Integer, nullable=False)
    primary_ability = db.Column(db.String(50), nullable=False) # e.g., "Strength, Intelligence"
    
    saving_throws_profs = db.Column(db.String(100), nullable=False) # e.g., "Strength, Constitution"
    skills_profs = db.Column(db.String(100), nullable=False) # e.g., "Athletics, Arcana"
    spellcasting_ability = db.Column(db.String(50), nullable=True) # e.g., "Intelligence"
    
    class_features = db.Column(db.String(200), nullable=True)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
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
    
    
class Proficiencies(db.Model):
    __tablename__ = 'proficiencies'
    
    id = db.Column(db.Integer, primary_key=True)
    proficiency_name = db.Column(db.String(100), nullable=False)
    
    proficiency_type = db.Column(db.String(50), nullable=False) # e.g., "Weapon, Armor, Tool"
    
    associated_ability = db.Column(db.String(50), nullable=True) # e.g., "Strength"
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Proficiency {self.proficiency_name}>'
    
    
class Actions(db.Model):
    __tablename__ = 'actions'
    
    id = db.Column(db.Integer, primary_key=True)
    action_name = db.Column(db.String(100), nullable=False)
    
    action_type = db.Column(db.String(50), nullable=False) # e.g., "Attack, Dash, Disengage"
    range = db.Column(db.String(50), nullable=True) # e.g., "Melee, Ranged"
    damage_dice = db.Column(db.String(50), nullable=True) # e.g., "1d8, 2d6"
    damage_type = db.Column(db.String(50), nullable=True) # e.g., "Slashing, Fire"
    
    description = db.Column(db.String(200), nullable=True)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Action {self.action_name}>'
    
    
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
    
    
class Characters(db.Model):
    __tablename__ = 'characters'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    level = db.Column(db.Integer, nullable=False, default=1)
    
    species_id = db.Column(db.Integer, db.ForeignKey('species.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    background_id = db.Column(db.Integer, db.ForeignKey('backgrounds.id'), nullable=False)
    stats_id = db.Column(db.Integer, db.ForeignKey('stats.id'), nullable=False)
    saves_id = db.Column(db.Integer, db.ForeignKey('saves.id'), nullable=False)
    size = db.Column(db.String(10), nullable=False)
    
    alignment = db.Column(db.String(50), nullable=True) # e.g., "Lawful Good"
    experience = db.Column(db.Integer, nullable=False, default=0)
    prof_bonus = db.Column(db.Integer, nullable=False, default=2)
    
    no_hit_dice = db.Column(db.Integer, nullable=False, default=1)
    per_level = db.Column(db.Integer, nullable=False, default=1)
    
    proficiency_id = db.Column(db.Integer, db.ForeignKey('proficiencies.id'), nullable=False)
    actions_id = db.Column(db.Integer, db.ForeignKey('actions.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Character {self.name}>'
    
    
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
    
    dm_id = db.Column(db.Integer, db.ForeignKey('dms.id'), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
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
    name = db.Column(db.String(100), nullable=False)
    monster_type = db.Column(db.String(50), nullable=False) 
    size = db.Column(db.String(10), nullable=False)
    alignment = db.Column(db.String(50), nullable=True) # e.g., "Chaotic Evil"
    armor_class = db.Column(db.Integer, nullable=False)
    hit_points = db.Column(db.Integer, nullable=False)
    speed = db.Column(db.String(50), nullable=False) # e.g., "30 ft., fly 60 ft."
    challenge_rating = db.Column(db.Float, nullable=False)
    
    senses = db.Column(db.String(100), nullable=True) # e.g., "Darkvision 60 ft."
    languages = db.Column(db.String(100), nullable=True) # e.g., "Common, Goblin"
    
    strength = db.Column(db.Integer, nullable=False)
    dexterity = db.Column(db.Integer, nullable=False)
    constitution = db.Column(db.Integer, nullable=False)
    intelligence = db.Column(db.Integer, nullable=False)
    wisdom = db.Column(db.Integer, nullable=False)
    charisma = db.Column(db.Integer, nullable=False)
    
    saving_throws = db.Column(db.String(100), nullable=True) # e.g., "Dexterity +3, Wisdom +2"
    
    actions = db.Column(db.String(100), nullable=True)
    legendary_actions = db.Column(db.String(100), nullable=True)
    
    immunities = db.Column(db.String(100), nullable=True) # e.g., "Fire, Poison"
    resistances = db.Column(db.String(100), nullable=True) # e.g., "Cold, Fire"
    vulnerabilities = db.Column(db.String(100), nullable=True) # e.g., "Acid, Lightning"
    
    description = db.Column(db.String(200), nullable=True)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
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
    
    
class Spells(db.Model):
    __tablename__ = 'spells'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    level = db.Column(db.Integer, nullable=False)
    school = db.Column(db.String(50), nullable=False)
    casting_time = db.Column(db.String(50), nullable=False)
    range = db.Column(db.String(50), nullable=False)
    components = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.String(50), nullable=False)
    concentration = db.Column(db.Boolean, nullable=False, default=False)
    description = db.Column(db.String(200), nullable=True)
    higher_levels = db.Column(db.String(200), nullable=True)
    classes = db.Column(db.String(100), nullable=True) # e.g., "Wizard, Sorcerer"
    ritual = db.Column(db.Boolean, nullable=False, default=False)
    damage = db.Column(db.Integer, nullable=False)
    damage_type = db.Column(db.String(50), nullable=True)
    damage_dice = db.Column(db.String(10), nullable=True) # e.g., "2d6"
    attack_type = db.Column(db.String(50), nullable=True) # e.g., "Melee, Ranged"
    saving_throw = db.Column(db.String(50), nullable=True) # e.g., "Dexterity, Wisdom"
    spell_attack_bonus = db.Column(db.Integer, nullable=True)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Spell {self.name}>'