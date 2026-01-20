export type SpreadPosition = {
    index: number;
    name: string;
};

export type Spread = {
    name: string;
    positions: SpreadPosition[];
    type: SpreadType;
};

export enum SpreadType {
    Daily = "daily",
    ThreeCard = "three_card",
    MindBodySpirit = "mind_body_spirit",
    LoveMoneyHome = "love_money_home",
    Decision = "decision",
    YesNo = "yes_no",
}

export const SPREADS: Record<SpreadType, Spread> = {
    [SpreadType.Daily]: {
        name: "Daily Insight",
        positions: [
            { index: 1, name: "Today's Focus"},
        ],
        type: SpreadType.Daily,
    },
    [SpreadType.ThreeCard]: {
        name: "Past / Present / Future",
        positions: [
            { index: 1, name: "Past"},
            { index: 2, name: "Present"},
            { index: 3, name: "Future"},
        ],
        type: SpreadType.ThreeCard,
    },
    [SpreadType.MindBodySpirit]: {
        name: "Mind / Body / Spirit",
        positions: [
            { index: 1, name: "Mind"},
            { index: 2, name: "Body"},
            { index: 3, name: "Spirit"},
        ],
        type: SpreadType.MindBodySpirit,
    },
    [SpreadType.LoveMoneyHome]: {
        name: "Love / Money / Home",
        positions: [
            { index: 1, name: "Love"},
            { index: 2, name: "Money"},
            { index: 3, name: "Home"},
        ],
        type: SpreadType.LoveMoneyHome,
    },
    [SpreadType.Decision]: {
        name: "Option A / Option B / Advice",
        positions: [
            { index: 1, name: "Option A" },
            { index: 2, name: "Option B" },
            { index: 3, name: "Advice" },
        ],
        type: SpreadType.Decision,
    },
    [SpreadType.YesNo]: {
        name: "Yes or No",
        positions: [
            { index: 1, name: "Answer" },
            { index: 2, name: "Answer" },
            { index: 3, name: "Answer" },
        ],
        type: SpreadType.YesNo,
    },
};

// Helper function to get spread by type
export function getSpread(spreadType: SpreadType): Spread {
    return SPREADS[spreadType];
}

// Helper function to get position info for a card
export function getPositionInfo(spreadType: SpreadType, cardPosition: number): SpreadPosition | undefined {
    return SPREADS[spreadType].positions.find(pos => pos.index === cardPosition);
}