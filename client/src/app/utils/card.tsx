import { EventHandlers, ThemeElement } from "@/app/utils/utils";

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
    key?: number;
    showNames?: boolean;
    events?: EventHandlers;
}) => {
    const translation = card.translations[language] || "Non traduit";
    // Choix aléatoire d'une URL parmi celles disponibles dans le tableau
    const randomUrl =
        card.urls[Math.floor(Math.random() * card.urls.length)];
    return (
        <div key={key} style={styles.card} {...events}>
            {showNames !== false && <h3>{translation}</h3>}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={randomUrl} alt={translation} style={styles.image} />
        </div>
    );
};
