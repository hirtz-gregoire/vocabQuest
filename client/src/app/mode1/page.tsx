    "use client";

import { useState, useEffect } from "react";

interface ThemeData {
    nameTheme: string;
    availableLanguages: string[];
    elements: ThemeElement[];
}

interface ThemeElement {
    urls: string[];
    translations: Record<string, string>; // language: translation
}

export default function Mode1Page() {
    const [data, setData] = useState<ThemeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/theme/animaux") // ✅ Vérifie bien cette URL
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data: ThemeData) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <h1>Chargement des images...</h1>;
    if (error) return <h1>Erreur : {error}</h1>;
    if (!data) return <h1>Aucune donnée trouvée</h1>;

    return (
        <div style={styles.container}>
            <h1>Galerie - {data.nameTheme}</h1>

            <div style={styles.gallery}>
                {data.elements.map((element, index) => {
                    const firstTranslation = Object.values(element.translations)[0] || "Non traduit";
                    return (
                        <div key={index} style={styles.card}>
                            <h3>{firstTranslation}</h3>
                            <img src={element.urls[0    ]} alt={firstTranslation} style={styles.image} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: { textAlign: "center", padding: "20px" },
    gallery: { display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" },
    card: { backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "10px", textAlign: "center", width: "220px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" },
    image: { width: "200px", height: "200px", borderRadius: "10px", objectFit: "cover" }
};
