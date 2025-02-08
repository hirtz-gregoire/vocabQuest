export type EventHandlers = Pick<
    React.DOMAttributes<HTMLDivElement>,
    Extract<keyof React.DOMAttributes<HTMLDivElement>, `on${string}`>
>;

export enum APIS {
    Theme,
    Language
}

export interface ThemeData {
    id: string;
    nameTheme: string;
    description: string;
    availableLanguages: string[];
    elements: ThemeElement[];
}

export interface ThemeElement {
    urls: string[];
    translations: Record<string, string>; // Clé = langue, Valeur = traduction
}

export function shuffle<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Échange des éléments
    }
    return array;
}
