export type Orientation = "upright" | "reversed"; // Adjust based on your actual Orientation enum values

export type DrawnCard = {
    name: string;
    number: number | null;
    arcana: string;
    element: string | null;
    suit: string | null;
    position: number;
    orientation: Orientation;
    image_url: string | null;
};