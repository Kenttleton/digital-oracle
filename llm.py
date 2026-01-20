from console import console 
import os
import httpx
import json
from typing import AsyncGenerator, List
from models import DrawnCard, SymbolismDepth

DEPTH_INSTRUCTIONS = {
    SymbolismDepth.LIGHT: """
Focus on surface themes and emotional resonance.
Keep symbolism accessible and direct.
""",
    SymbolismDepth.STANDARD: """
Balance symbolism with practical reflection.
Connect card imagery to inner states and choices.
""",
    SymbolismDepth.DEEP: """
Explore archetypal symbolism and underlying patterns.
Reflect on subconscious dynamics and long-term themes.
""",
}

OLLAMA_URL = os.getenv(
    "OLLAMA_URL",
    "http://localhost:11434",
)
MODEL = os.getenv(
    "OLLAMA_MODEL",
    "gemma2:2b",
)

SYSTEM_PROMPT = """You are a wise and mystical tarot reader with decades of experience interpreting the cards. You speak with warmth, insight, and a touch of mystery. Your readings blend traditional tarot symbolism with intuitive guidance, helping seekers find clarity and direction in their lives.

When interpreting cards, you:
- Weave the card meanings into a cohesive narrative
- Consider the interplay between cards in the spread
- Balance honesty with encouragement
- Use evocative, mystical language while remaining clear and accessible
- Speak directly to the seeker's situation with empathy, warmth, clarity, and symbolic insight.
- Interpret cards metaphorically, not literally.
- Reversed cards indicate blocked, internalized, or distorted energy.
- Do not predict fixed outcomes or give absolute statements.
- Do not mention chance, randomness, or AI.
- Offer reflection, not instruction.
"""

def format_cards(cards: List[DrawnCard]) -> str:
    lines = []
    for card in cards:
        lines.append(
            f"""- {card.name} 
    - Position Meaning: {card.position_meaning}
    - Orientation Meaning: {card.orientation_meaning}
    - Card Meaning: {card.meaning}
    - Card Description: {card.description}""")
    return "\n".join(lines)

def build_prompt(question: str, cards: List[DrawnCard], spread_name: str,  depth: SymbolismDepth = SymbolismDepth.STANDARD) -> str:
    return f"""
The seeker asks:
"{question}"

Spread used: {spread_name}

Cards drawn:
{format_cards(cards)}

Interpretation depth:
{DEPTH_INSTRUCTIONS[depth]}

Instructions:
- Interpret each card in its position.
- Weave the cards into a cohesive narrative.
- End with gentle guidance, not commands.
- Limit the reading to around 200 words or less.
"""

async def interpret_reading(
    question: str,
    cards: List[DrawnCard],
    spread_name: str,
    depth: SymbolismDepth = SymbolismDepth.STANDARD,
) -> AsyncGenerator[str, None]:
    prompt = build_prompt(question, cards, spread_name, depth)
    data = {
        "model": MODEL,
        "system": SYSTEM_PROMPT,
        "prompt": prompt,
        "stream": True,
    }
    console.info(f"LLM JSON: {data}")

    try:
        async with httpx.AsyncClient(timeout=160.0) as client:
            async with client.stream(
                "POST",
                f"{OLLAMA_URL}/api/generate",
                json=data,
            ) as response:
                if response.status_code != 200:
                    error_text = await response.aread()
                    console.error(f"Ollama API error (status {response.status_code}): {error_text.decode()}")
                    raise httpx.HTTPStatusError(
                        f"Ollama returned status {response.status_code}",
                        request=response.request,
                        response=response
                    )
                async for line in response.aiter_lines():
                    if line:
                        try:
                            json_chunk = json.loads(line)

                            # Check for errors in the response
                            if 'error' in json_chunk:
                                console.error(f"Ollama error in stream: {json_chunk['error']}")
                                raise Exception(f"Ollama error: {json_chunk['error']}")
                            
                            text = json_chunk.get('response', '')
                            if text:
                                yield text
                                
                            # Check if stream is done
                            if json_chunk.get('done', False):
                                console.info("Stream completed successfully")
                                break

                        except json.JSONDecodeError:
                            console.error(f"Failed to decode JSON chunk: {line}")
                            continue

    except httpx.TimeoutException as e:
        console.error(f"Timeout error - Ollama took too long to respond: {str(e)}")
        yield (
            "The cards suggest a moment of reflection. Consider how their symbols resonate with your current path."
        )
    except httpx.HTTPStatusError as e:
        console.error(f"HTTP status error: {e.response.status_code} - {str(e)}")
        yield (
            "The cards suggest a moment of reflection. Consider how their symbols resonate with your current path."
        )
    except httpx.RequestError as e:
        console.error(f"Request error - Could not connect to Ollama: {type(e).__name__}: {str(e)}")
        yield (
            "The cards suggest a moment of reflection. Consider how their symbols resonate with your current path."
        )
    except Exception as e:
        console.error(f"Unexpected LLM error - {type(e).__name__}: {str(e)}")
        import traceback
        console.error(f"Traceback: {traceback.format_exc()}")
        yield (
            "The cards suggest a moment of reflection. Consider how their symbols resonate with your current path."
        )
    except httpx.HTTPError as e:
        console.error(f"HTTP error: {e}")
        yield (
            "The cards suggest a moment of reflection. Consider how their symbols resonate with your current path."
        )
