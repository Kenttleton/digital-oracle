import json, hashlib
from models import Card

def reading_hash(question: str, cards: list[Card]) -> str:
    payload = {
        "question": question.lower().strip(),
        "cards": serialize_cards(cards),
    }
    return hashlib.sha256(
        json.dumps(payload, sort_keys=True).encode()
    ).hexdigest()

def serialize_cards(cards: list[Card]) -> list[Card]:
        return [
        {
            "name": c.name,
            "number": c.number,
            "arcana": c.arcana,
            "element": c.element,
            "suit": c.suit,
            "orientation": c.orientation,
            "position": c.position,
            "image_url": c.image_url,
        }
        for c in cards
    ]