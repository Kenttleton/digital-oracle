import deck
import uvicorn
import time
from pathlib import Path
from db import lifespan
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from models import DrawRequest, DrawResponse, InterpretRequest
from spreads import SPREADS
from deck import draw_cards
from llm import interpret_reading
from console import console

app = FastAPI(lifespan=lifespan)

@app.middleware("http")
async def log_response_time(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    console.info(f"Duration: {process_time:.4f}s")
    return response

@app.post("/api/draw", response_model=DrawResponse)
async def draw(req: DrawRequest) -> DrawResponse:
    spread = SPREADS.get(req.spread)
    console.info(f"Requested spread: {req.spread}, Found: {spread}")
    if not spread:
        raise HTTPException(400, "Invalid spread")

    cards = await draw_cards(app, spread)
    console.info(f"Drawn cards: {[c.name for c in cards]}")
    cards_json = [c.dict() for c in cards]
    return DrawResponse(cards=cards_json, spread=req.spread)

@app.post("/api/interpret")
async def interpret_cards(req: InterpretRequest):
    spread = SPREADS.get(req.spread)
    console.info(f"Requested spread: {req.spread}, Found: {spread}")
    if not spread:
        raise HTTPException(400, "Invalid spread")

    cards = await deck.get_cards(app, spread, req.cards)
    console.info(f"Cards for interpretation: {[f"{c.name} ({c.orientation})" for c in cards]}")
    if not cards:
        raise HTTPException(400, "Invalid cards for the spread")

    return StreamingResponse(interpret_reading(req.question, cards, req.spread, req.depth), media_type="text/event-stream")

@app.get("/api/health")
async def health():
    """Health check endpoint"""
    try:
        async with app.state.db_pool.acquire() as conn:
            async with conn.cursor() as cursor:
                await cursor.execute("SELECT 1")
                await cursor.fetchone()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        console.error(f"Database connection failed: {str(e)}")
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")

# Mount static files and serve React app
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/assets", StaticFiles(directory=static_dir / "assets"), name="assets")
    app.mount("/images", StaticFiles(directory=static_dir / "images"), name="images")
    
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        """Serve React app for all non-API routes"""
        if full_path and not full_path.startswith("api"):
            file_path = static_dir / full_path
            if file_path.exists() and file_path.is_file():
                return FileResponse(file_path)
        return FileResponse(static_dir / "index.html")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)