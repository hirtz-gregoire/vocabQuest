import { EventHandlers, shuffle, ThemeData } from "@/app/utils/utils";
import {Card, CardEventHandlers} from "@/app/utils/card";
import {Dispatch, SetStateAction} from "react";

export const gallery = ({
                            gallery,
                            styles,
                            selectedLanguage,
                            cardCount,
                            randomize,
                            showNames,
                            events,
                            cardEvents,
                            goodCard,
                            setResetKey,
                        }: {
    gallery: ThemeData;
    styles: {
        gallery: React.CSSProperties;
        card: React.CSSProperties;
        image: React.CSSProperties;
    };
    selectedLanguage?: string; // Default : première langue disponible
    cardCount?: number; // Default : tous les éléments
    randomize?: boolean; // Default : non
    showNames?: boolean; // Default : oui
    events?: EventHandlers;
    cardEvents?: CardEventHandlers;
    goodCard?: number;
    setResetKey?: () => void;
}) => {
    let cards = gallery.elements;
    if (randomize === true) cards = shuffle(cards);
    cards = cards.slice(0, cardCount);
    const useAwnser = typeof goodCard !== 'undefined';
    goodCard = (useAwnser) ? goodCard : -1;

    return (
        <div style={styles.gallery} {...events}>
            {cards.map((element, index) => (
                <Card
                    key={index}
                    myKey={index}
                    card={element}
                    language={selectedLanguage || Object.keys(element.translations)[0]}
                    styles={{ card: styles.card, image: styles.image }}
                    showNames={showNames}
                    events={cardEvents}
                    isGoodCard={index === goodCard}
                    setResetKey={setResetKey}
                    useAwnser={useAwnser}
                />
            ))}
        </div>
    );
};