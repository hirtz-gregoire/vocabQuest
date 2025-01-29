import { NextResponse } from "next/server";
import animaux from "@/../public/data/animaux.json"; // Charger depuis `public/`

export async function GET() {
    return NextResponse.json(animaux);
}
