"use client";
import {useEffect, useState} from "react";
import {APIS, ThemeData} from "@/app/utils/utils";
import {gallery} from "@/app/utils/gallery";
import {add_selector} from "@/app/utils/add_selector";

export default function Mode1Page() {
    const [themes, setThemes] = useState<ThemeData[] | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");

    const [data, setData] = useState<ThemeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(selectedTheme === null) return;

        setLoading(true);
        fetch(`/api/theme/${selectedTheme.id}`) //TODO : use real API
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
    }, [selectedTheme]);

    useEffect(() => {
        fetch("/api/themes") //TODO : use real API
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data: ThemeData[]) => {
                setThemes(data);
                setSelectedTheme(data[0]);
                setSelectedLanguage(data[0].availableLanguages[0])
            })
            .catch((error) => {
                setError(error.message);
            });
    }, []);

    if (loading) return <h1>Chargement des images...</h1>;
    if (error) return <h1>Erreur : {error}</h1>;
    if (!data) return <h1>Aucune donnée trouvée</h1>;

    const handleThemeChange = (selectedTheme: string) => {
        const theme = (themes??[]).find((theme) => theme.id === selectedTheme);

        if (theme) {
            setSelectedTheme(theme);
        } else {
            setSelectedTheme(null);
        }
    };

    const themesOptions = (themes ?? []).map((theme) => ({
        value: theme.id,
        label: theme.nameTheme,
    }));
    const languageOptions = (selectedTheme != null)
        ? selectedTheme.availableLanguages.map((language) => ({
            value: language,
            label: language,
        }))
        : [];

    return (
        <div style={styles.container}>
            <h1>Galerie - {data.nameTheme}</h1>
            <p>{data.description}</p>
            {add_selector({options: themesOptions, apiToUse: APIS.Theme, onOptionSelected: handleThemeChange})}
            {add_selector({options: languageOptions, apiToUse: APIS.Language, onOptionSelected: (selectedLanguage: string) => setSelectedLanguage(selectedLanguage)})}
            {gallery({
                gallery: data,
                styles: { gallery: styles.gallery, card: styles.card, image: styles.image },
                showNames: true,
                cardCount: 5,
                randomize: true,
                selectedLanguage: selectedLanguage,
                cardEvents: {
                    // TODO : Remove theses example events
                    onMouseOver: (event) => {
                        event.currentTarget.style.backgroundColor = "blue";
                    },
                    onMouseOut: (event) => {
                        event.currentTarget.style.backgroundColor = "";
                    },
                },
            })}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: { textAlign: "center", padding: "20px" },
    gallery: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
    },
    card: {
        backgroundColor: "#f9f9f9",
        padding: "15px",
        borderRadius: "10px",
        textAlign: "center",
        width: "220px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    image: {
        width: "200px",
        height: "200px",
        borderRadius: "10px",
        objectFit: "cover",
    },
};
