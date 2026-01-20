from typing import Optional
import aiomysql
import os
from fastapi import FastAPI
from contextlib import asynccontextmanager

from models import DatabaseCard

_deck_cache: Optional[list[DatabaseCard]] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create the connection pool (before 'yield' is startup logic)
    app.state.db_pool = await aiomysql.create_pool(
        host=os.getenv('DB_HOST', 'localhost'),
        port=int(os.getenv('DB_PORT', 3306)),
        user=os.getenv('DB_USER', 'tarot_user'),
        password=os.getenv('DB_PASSWORD', 'tarot_pass'),
        db=os.getenv('DB_NAME', 'tarot_db'),
        autocommit=True
    )
    yield
    # Close the connection pool (after 'yield' is shutdown logic)
    app.state.db_pool.close()
    await app.state.db_pool.wait_closed()

async def get_full_deck(app: FastAPI) -> list[DatabaseCard]:
    global _deck_cache
    if _deck_cache is None:
        pool = app.state.db_pool
        async with pool.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    "SELECT name, number, arcana, element, suit, meaning_key, meaning_upright, meaning_reversed, description, image_url FROM tarot_cards ORDER BY id"
                )
                rows = await cur.fetchall()
                _deck_cache = [
                    DatabaseCard(
                        name=row[0],
                        number=row[1],
                        arcana=row[2],
                        element=row[3],
                        suit=row[4],
                        meaning_key=row[5],
                        meaning_upright=row[6],
                        meaning_reversed=row[7],
                        description=row[8],
                        image_url=row[9],
                    )
                    for row in rows
                ]
    return list(_deck_cache)
    
