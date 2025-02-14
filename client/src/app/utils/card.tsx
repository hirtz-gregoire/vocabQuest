import { EventHandlers, ThemeElement } from "@/app/utils/utils";
import {SetStateAction, SyntheticEvent} from "react";
import {speechAPI} from "@/app/utils/speechAPI";

export type CardEventHandlers = {
    [K in keyof EventHandlers]?: (event: React.SyntheticEvent, card: CardProps) => void;
};

export interface CardProps {
    card: ThemeElement;
    language: string;
    styles: { card: React.CSSProperties; image: React.CSSProperties };
    myKey?: number;
    showNames?: boolean;
    events?: CardEventHandlers;
    isGoodCard?: boolean;
    setResetKey?: () => void;
    useAwnser?: boolean;
}

export const Card = ({
                         card,
                         language,
                         styles,
                         myKey,
                         showNames,
                         events,
                         isGoodCard,
                        setResetKey,
                        useAwnser,
                     }: CardProps) => {

    const handleClick = () => {
        document.body.style.transition = "background-color 0.4s ease-in-out";

        if(isGoodCard) {
            document.body.style.backgroundColor = "lightgreen";
            speechAPI.synth.cancel();
            speechAPI.setLanguage("fr");
            speechAPI.requestSynth("Bonne réponse !");
        }
        else {
            document.body.style.backgroundColor = "#FFCCCB";
            speechAPI.synth.cancel();
            speechAPI.setLanguage("fr");
            speechAPI.requestSynth("Mauvaise réponse.");
        }

        setTimeout(
            () => {
                document.body.style.backgroundColor = "white";
                if (setResetKey) {
                    setResetKey();
                }
            }, 400
        )
    };

    const mapEventHandler = (eventName: keyof CardEventHandlers) => {
        return (event: SyntheticEvent<Element, Event>) => {
            events?.[eventName]?.(event, { card, language, styles, myKey: myKey, showNames });
        };
    };

    const eventHandlers = events
        ? Object.keys(events).reduce((acc, key) => {
            const typedKey = key as keyof CardEventHandlers;
            acc[typedKey] = mapEventHandler(typedKey);
            return acc;
        }, {} as React.HTMLProps<HTMLDivElement>)
        : {};

    const translation = card.translations[language] || "Non traduit";

    if(isGoodCard) {
        speechAPI.requestSynth(translation);
    }

    // Choix aléatoire d'une URL parmi celles disponibles dans le tableau
    const randomUrl =
        card.urls[Math.floor(Math.random() * card.urls.length)];

    if(useAwnser) {
        return (
            <div key={myKey} style={styles.card} {...eventHandlers} onClick={handleClick}>
                {showNames !== false && <h3 style={titleStyle}>{translation}</h3>}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={randomUrl} alt={translation} style={styles.image} />
            </div>
        );
    }
    else {
        return (
            <div key={myKey} style={styles.card} {...eventHandlers}>
                {showNames !== false && <h3 style={titleStyle}>{translation}</h3>}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={randomUrl} alt={translation} style={styles.image} />
            </div>
        );
    }
};

const titleStyle: React.CSSProperties = {
    margin: "0px",
    marginBottom: "5px",
    fontSize: "1.5vmax"
}