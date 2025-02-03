export type EventHandlers = Pick<
    React.DOMAttributes<HTMLDivElement>,
    Extract<keyof React.DOMAttributes<HTMLDivElement>, `on${string}`>
>;

export interface ThemeData {
    nameTheme: string;
    availableLanguages: string[];
    elements: ThemeElement[];
}

export interface ThemeElement {
    urls: string[];
    translations: Record<string, string>; // language: translation
}

export function shuffle<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}