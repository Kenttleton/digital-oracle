from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class SpreadPosition:
    index: int
    name: str
    meaning: str
    is_yes_no: Optional[bool] = None

@dataclass(frozen=True)
class Spread:
    name: str
    positions: list[SpreadPosition]
    instructions: str

SPREADS: dict[str, Spread] = {
    "daily": Spread(
        name="Daily Insight",
        positions=[
            SpreadPosition(1, "Today's Focus", "What do I need to know today?", is_yes_no=False),
        ],
        instructions="Draw one card to gain insight for the day."
    ),
    "three_card": Spread(
        name="Past / Present / Future",
        positions=[
            SpreadPosition(1, "Past", "What past influences are affecting the situation?", is_yes_no=False),
            SpreadPosition(2, "Present", "What is the current state or challenge?", is_yes_no=False),
            SpreadPosition(3, "Future", "What is the likely outcome or future influence?", is_yes_no=False),
        ],
        instructions="Draw three cards representing past, present, and future influences."
    ),
    "mind_body_spirit": Spread(
        name="Mind / Body / Spirit",
        positions=[
            SpreadPosition(1, "Mind", "What is the state of the mind?", is_yes_no=False),
            SpreadPosition(2, "Body", "What is the state of the body?", is_yes_no=False),
            SpreadPosition(3, "Spirit", "What is the state of the spirit?", is_yes_no=False),
        ],
        instructions="Draw three cards to explore the state of mind, body, and spirit."
    ),
    "love_money_home": Spread(
        name="Love / Money / Home",
        positions=[
            SpreadPosition(1, "Love", "What is the state of love or relationships?", is_yes_no=False),
            SpreadPosition(2, "Money", "What is the state of finances or career?", is_yes_no=False),
            SpreadPosition(3, "Home", "What is the state of home or family?", is_yes_no=False),
        ],
        instructions="Draw three cards to explore the state of love, money, and home."
    ),
    "decision": Spread(
        name="Option A / Option B / Advice",
        positions=[
            SpreadPosition(1, "Option A", "What is the situation or outcome?", is_yes_no=False),
            SpreadPosition(2, "Option B", "What is the situation or outcome?", is_yes_no=False),
            SpreadPosition(3, "Advice", "What advice or guidance is offered?", is_yes_no=False),
        ],
        instructions="Draw three cards to compare two options and receive advice."
    ),
    "yes_no": Spread(
        name="Yes or No",
        positions=[
            SpreadPosition(1, "Answer", "Will the outcome be yes or no?", is_yes_no=True),
            SpreadPosition(2, "Answer", "Will the outcome be yes or no?", is_yes_no=True),
            SpreadPosition(3, "Answer", "Will the outcome be yes or no?", is_yes_no=True),
        ],  
        instructions="Draw three cards to determine a yes or no answer."
    ),
}
