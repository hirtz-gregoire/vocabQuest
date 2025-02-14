"use client";
import {useEffect, useState} from "react";
import {APIS, shuffle, ThemeData} from "@/app/utils/utils";
import {gallery} from "@/app/utils/gallery";
import {add_selector} from "@/app/utils/add_selector";
import Link from "next/link";
import Switch from "react-switch";
import {speechAPI} from "@/app/utils/speechAPI";
import {CardProps} from "@/app/utils/card";
import {styles} from "@/app/mode1/page";

export default function Mode1Page() {
    const [themes, setThemes] = useState<ThemeData[] | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");

    const [showNames, setShowNames] = useState<boolean>(true);
    const [data, setData] = useState<ThemeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [resetKey, setResetKey] = useState<number>(0);

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

    // Load list of themes
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
    const cardCount = 12;
    const selectedCard = Math.round(Math.random()*12);
    data.elements = shuffle(data.elements).slice(0, cardCount);

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
            <button onClick={()=> speechAPI.requestSynth(data?.elements[selectedCard].translations[selectedLanguage])}>
                Prononcer le mot
            </button>
            {gallery({
                gallery: data,
                styles: {gallery: styles.gallery, card: styles.card, image: styles.image},
                showNames: showNames,
                cardCount: cardCount,
                randomize: true,
                selectedLanguage: selectedLanguage,
                setResetKey: () => setResetKey(prevKey => prevKey + 1),
                goodCard: selectedCard,
                cardEvents: {
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