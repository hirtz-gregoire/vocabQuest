import { EventHandlers, shuffle, ThemeData } from "@/app/utils/utils";
import { card } from "@/app/utils/card";

export const gallery = ({
                            gallery,
                            styles,
                            selectedLanguage,
                            cardCount,
                            randomize,
                            showNames,
                            events,
                            cardEvents,
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
    cardEvents?: EventHandlers;
}) => {
    let cards = gallery.elements;
    if (randomize === true) cards = shuffle(cards);
    cards = cards.slice(0, cardCount);

    return (
        <div style={styles.gallery} {...events}>
            {cards.map((element, index) => {
                return card({
                    card: element,
                    language: selectedLanguage
                        ? selectedLanguage
                        : Object.keys(element.translations)[0],
                    styles: { card: styles.card, image: styles.image },
                    key: index,
                    showNames: showNames,
                    events: cardEvents,
                });
            })}
        </div>
    );
};
