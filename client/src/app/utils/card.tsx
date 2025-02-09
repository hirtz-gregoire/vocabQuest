import { EventHandlers, ThemeElement } from "@/app/utils/utils";
import { SyntheticEvent } from "react";

export type CardEventHandlers = {
    [K in keyof EventHandlers]?: (event: React.SyntheticEvent, card: CardProps) => void;
};

export interface CardProps {
    card: ThemeElement;
    language: string;
    styles: { card: React.CSSProperties; image: React.CSSProperties };
    key?: number;
    showNames?: boolean;
    events?: CardEventHandlers;
}

export const card = ({
                         card,
                         language,
                         styles,
                         key,
                         showNames,
                         events,
                     }: CardProps) => {

    const mapEventHandler = (eventName: keyof CardEventHandlers) => {
        return (event: SyntheticEvent<Element, Event>) => {
            events?.[eventName]?.(event, { card, language, styles, key, showNames });
        };
    };

    const eventHandlers = events
        ? Object.keys(events).reduce((acc, key) => {
            const typedKey = key as keyof CardEventHandlers;
            acc[typedKey] = mapEventHandler(typedKey); // Map each event to the corresponding handler
            return acc;
        }, {} as React.HTMLProps<HTMLDivElement>) // Ensure correct typing for div props
        : {};

    const translation = card.translations[language] || "Non traduit";

    // Choix aléatoire d'une URL parmi celles disponibles dans le tableau
    const randomUrl =
        card.urls[Math.floor(Math.random() * card.urls.length)];

    return (
        <div key={key} style={styles.card} {...eventHandlers}>
            {showNames !== false && <h3 style={titleStyle}>{translation}</h3>}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={randomUrl} alt={translation} style={styles.image} />
        </div>
    );
};

const titleStyle: React.CSSProperties = {
    margin: "0px",
    marginBottom: "5px"
}
