import {EventHandlers, shuffle, ThemeData} from "@/app/utils/utils";
import {card} from "@/app/utils/card";

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
    styles: { gallery: React.CSSProperties; card: React.CSSProperties; image: React.CSSProperties };
    selectedLanguage?: string | undefined, // Default : First
    cardCount?: number | undefined, // Default : All
    randomize?: boolean | undefined, // Default : no
    showNames?: boolean | undefined, // Default : yes
    events?: EventHandlers | undefined,
    cardEvents?: EventHandlers | undefined,
}) => {
    let cards = gallery.elements;
    if(randomize === true) cards = shuffle(cards);
    cards = cards.slice(0, cardCount)

    return <div style={styles.gallery} {...events}>
        {cards.map((element, index) => {
            return card({
                    card: element,
                    language: (selectedLanguage) ? selectedLanguage : Object.keys(element.translations)[0],
                    styles: {card: styles.card, image: styles.image},
                    key: index,
                    showNames: showNames,
                    events: cardEvents
                }
            );
        })
        }
    </div>
};