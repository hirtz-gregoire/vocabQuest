"use client";
import {useEffect, useState} from "react";
import {APIS, ThemeData} from "@/app/utils/utils";
import {gallery} from "@/app/utils/gallery";
import {add_selector} from "@/app/utils/add_selector";
import Link from "next/link";
import Switch from "react-switch";
import {speechAPI} from "@/app/utils/speechAPI";
import {CardProps} from "@/app/utils/card";

export default function Mode1Page() {
    const [themes, setThemes] = useState<ThemeData[] | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");

    const [showNames, setShowNames] = useState<boolean>(true);
    const [data, setData] = useState<ThemeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check for landscape mode
    const [isinLandscape, setIsinLandscape] = useState(
        window.matchMedia("(orientation:landscape)").matches
    )

    useEffect(() => {
        window
            .matchMedia("(orientation:landscape)")
            .addEventListener('change', e => setIsinLandscape( e.matches ));
    }, []);

    // Load theme data
    useEffect(() => {
        if(selectedTheme === null) return;

        setLoading(true);
        fetch(`/api/theme/${selectedTheme.id}`)
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

    // Load list of themes
    useEffect(() => {
        fetch("/api/themes")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data: ThemeData[]) => {
                setThemes(data);
                if (data.length > 0) {
                    setSelectedTheme(data[0]);
                    if (data[0].availableLanguages.length > 0) {
                        setSelectedLanguage(data[0].availableLanguages[0]);
                    }
                }
            })
            .catch((error) => {
                setError(error.message);
            });
    }, []);

    // Handle special cases
    let errorMessage = "";
    if (!data) errorMessage = "Aucune donnée trouvée";
    if (loading) errorMessage = "Chargement des images...";
    if (error) errorMessage = `Erreur : ${error}`;
    if (!isinLandscape) errorMessage = `Veuillez tourner votre navigateur en mode paysage.`;

    if(errorMessage !== "") return (
        <div>
            <Link href="/">
                <img className={"return-button"} style={styles.return}
                     src={"https://cdn-icons-png.flaticon.com/512/6392/6392143.png"}/>
            </Link>
            <h1 style={styles.errorText}>{errorMessage}</h1>
        </div>
    );
    if (!data) return "We are pleasing the compiler..";

    // The actual page
    speechAPI.setLanguage(selectedLanguage)

    const handleThemeChange = (selectedTheme: string) => {
        const theme = (themes??[]).find((theme) => theme.id === selectedTheme);
        setSelectedTheme(theme ? theme : null)
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
            <Link href="/" onClick={()=>{speechAPI.synth.cancel();}}>
                <img className={"return-button"} style={styles.return}
                     src={"https://cdn-icons-png.flaticon.com/512/6392/6392143.png"}/>
            </Link>
            <h1>Galerie - {data.nameTheme}</h1>
            <p>{data.description}</p>
            {add_selector({options: themesOptions, apiToUse: APIS.Theme, onOptionSelected: handleThemeChange})}
            {add_selector({
                options: languageOptions,
                apiToUse: APIS.Language,
                onOptionSelected: (selectedLanguage: string) => {
                    setSelectedLanguage(selectedLanguage)
                }
            })}
            <label style={styles.toggle}>
                <span>Afficher les noms</span>
                <Switch onChange={(checked)=> setShowNames(checked)} checked={showNames}/>
            </label>
            {gallery({
                gallery: data,
                styles: {gallery: styles.gallery, card: styles.card, image: styles.image},
                showNames: showNames,
                cardCount: 10000,
                randomize: true,
                selectedLanguage: selectedLanguage,
                cardEvents: {
                    onClick: (event, card: CardProps) => {
                        const translation = card.card.translations[card.language] || "Non traduit";
                        speechAPI.synth.cancel();
                        speechAPI.requestSynth(translation);
                    },
                    onMouseOver: (event) => {
                        const targetElement = event.currentTarget as HTMLElement;
                        targetElement.style.backgroundColor = "blue";
                    },
                    onMouseOut: (event) => {
                        const targetElement = event.currentTarget as HTMLElement;
                        targetElement.style.backgroundColor = "";
                    },
                },
            })}
        </div>
    );
}

export const styles: Record<string, React.CSSProperties> = {
    container: {textAlign: "center", padding: "20px"},
    gallery: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.9vmax",
        justifyContent: "center",
    },
    card: {
        backgroundColor: "#f9f9f9",
        padding: "0.7vmax",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    },
    image: {
        width: "12vmax",
        height: "12vmax",
        borderRadius: "10px",
        objectFit: "cover",
    },
    return: {
        width: "60px",
        height: "60px",
        position: "absolute",
        left: "15px",
        top: "15px"
    },
    toggle: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        justifyContent: "center"
    },
    errorText: {
        marginTop: "70px",
    }
};
