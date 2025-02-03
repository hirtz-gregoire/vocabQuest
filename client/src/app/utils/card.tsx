import {EventHandlers, ThemeElement} from "@/app/utils/utils";

export const card = ({
                         card,
                         language,
                         styles,
                         key,
                         showNames,
                         events,
                     }: {
    card: ThemeElement;
    language: string;
    styles: { card: React.CSSProperties; image: React.CSSProperties };
    key?: number | undefined;
    showNames?: boolean | undefined;
    events?: EventHandlers | undefined
}) => {
    const translation = card.translations[language] || "Non traduit";
    return (
        <div key={key} style={styles.card} {...events}>
            {showNames != false && <h3>{translation}</h3>}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.urls[0]} alt={translation} style={styles.image}/>
        </div>
    );
};