import { NextResponse } from "next/server";
import fakeThemes from "@/../public/fakeThemes/fakeThemes.json"; // Charger depuis `public/`

export async function GET() {
    return NextResponse.json(fakeThemes);
}
