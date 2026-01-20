from os import name
import random
from fastapi import FastAPI
from typing import List
from models import Card, DrawnCard
from spreads import Spread
from db import get_full_deck

REVERSAL_PROBABILITY = 0.35

async def draw_cards(app: FastAPI, spread: Spread) -> List[DrawnCard]:
    deck = await get_full_deck(app)
    random.shuffle(deck)

    drawn = []
    for pos in spread.positions:
        orientation = (
            "reversed" if random.random() < REVERSAL_PROBABILITY else "upright"
        )
        drawn.append(
            DrawnCard(
                name=deck[pos.index].name,
                number=deck[pos.index].number,
                arcana=deck[pos.index].arcana,
                element=deck[pos.index].element,
                suit=deck[pos.index].suit,
                orientation=orientation,
                position=pos.index,
                position_meaning=pos.meaning,
                orientation_meaning=deck[pos.index].meaning_upright if orientation == "upright" else deck[pos.index].meaning_reversed,
                meaning=deck[pos.index].meaning_key,
                description=deck[pos.index].description,
                image_url=deck[pos.index].image_url,
            )
        )
    return drawn

async def get_cards(app: FastAPI, spread: Spread, cards: list[Card]) -> list[DrawnCard] | None:
    deck = await get_full_deck(app)
    drawn = []
    for position in spread.positions:
        card = cards[position.index - 1]
        for db_card in deck:
            if card.name == db_card.name:
                drawn.append(
                    DrawnCard(
                    name=card.name,
                    number=card.number,
                    arcana=card.arcana,
                    element=card.element,
                    suit=card.suit,
                    orientation=card.orientation,
                    position=position.index,
                    position_meaning=position.meaning,
                    orientation_meaning=db_card.meaning_upright if card.orientation == "upright" else db_card.meaning_reversed,
                    meaning=db_card.meaning_key,
                    description=db_card.description,
                    image_url=db_card.image_url,
                ))
    return drawn