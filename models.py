from enum import Enum
from pydantic import BaseModel
from typing import Optional, Literal, List

Orientation = Literal["upright", "reversed"]

"""Symbolism Depth"""
class SymbolismDepth(str, Enum):
    LIGHT = "light"
    STANDARD = "standard"
    DEEP = "deep"
    
class DatabaseCard(BaseModel):
    name: str
    number: Optional[int]
    arcana: str
    element: Optional[str] = None
    suit: Optional[str] = None
    meaning_key: Optional[str] = None
    meaning_upright: Optional[str] = None
    meaning_reversed: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

class DrawnCard(BaseModel):
    name: str
    number: Optional[int]
    arcana: str
    element: Optional[str] = None
    element_meaning: Optional[str] = None
    suit: Optional[str] = None
    suit_meaning: Optional[str] = None
    position: int
    position_meaning: str
    orientation: Orientation
    orientation_meaning: Optional[str] = None
    meaning: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

class Card(BaseModel):
    name: str
    number: Optional[int]
    arcana: str
    element: Optional[str] = None
    suit: Optional[str] = None
    position: int
    orientation: Orientation
    image_url: Optional[str] = None

class InterpretRequest(BaseModel):
    question: str
    spread: str = "three_card"
    cards: List[Card]
    depth: SymbolismDepth = SymbolismDepth.STANDARD

class DrawRequest(BaseModel):
    spread: str = "three_card"

class DrawResponse(BaseModel):
    cards: List[Card]
    spread: str

class No(Enum):
    """Swords No cards"""
    THREE_OF_SWORDS = "Three of Swords"
    FIVE_OF_SWORDS = "Five of Swords"
    SIX_OF_SWORDS = "Six of Swords"
    SEVEN_OF_SWORDS = "Seven of Swords"
    EIGHT_OF_SWORDS = "Eight of Swords"
    NINE_OF_SWORDS = "Nine of Swords"
    TEN_OF_SWORDS = "Ten of Swords"
    KNIGHT_OF_SWORDS = "Knight of Swords"
    """Cups No cards"""
    FIVE_OF_CUPS = "Five of Cups"
    SEVEN_OF_CUPS = "Seven of Cups"
    EIGHT_OF_CUPS = "Eight of Cups"
    """Pentacles No cards"""
    FIVE_OF_PENTACLES = "Five of Pentacles"
    """Major Arcana No cards"""
    DEATH = "Death"
    THE_DEVIL = "The Devil"
    THE_TOWER = "The Tower"
    THE_MOON = "The Moon"

class Neutral(Enum):
    """Swords Neutral cards"""
    FOUR_OF_SWORDS = "Four of Swords"
    """Cups Neutral cards"""
    FOUR_OF_CUPS = "Four of Cups"
    """Major Arcana Neutral cards"""
    THE_HERMIT = "The Hermit"
    THE_HANGED_MAN = "The Hanged Man"

"""Exceptions"""
class NotYetKnown(Enum):
    TWO_OF_SWORDS = "Two of Swords"
    TEN_OF_WANDS = "Ten of Wands"

class YesWithFight(Enum):
    FIVE_OF_WANDS = "Five of Wands"
    SEVEN_OF_WANDS = "Seven of Wands"


