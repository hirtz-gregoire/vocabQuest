"use client";
import {useEffect, useState} from "react";
import {APIS, shuffle, ThemeData, ThemeElement} from "@/app/utils/utils";
import {gallery} from "@/app/utils/gallery";
import {add_selector} from "@/app/utils/add_selector";
import Link from "next/link";
import Switch from "react-switch";
import {speechAPI} from "@/app/utils/speechAPI";
import {styles} from "@/app/mode1/page";

export default function Mode3Page() {
    const [themes, setThemes] = useState<ThemeData[] | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    const [displayedText, setDisplayedText] = useState<string>("");

    const [showNames, setShowNames] = useState<boolean>(true);
    const [data, setData] = useState<ThemeData | null>(null);
    const [elements, setElements] = useState<ThemeElement[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                setElements(shuffle(data.elements).slice(0, 1));
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
    if (!speechAPI.recognition) errorMessage = "Reconnaissance vocal non supporté sur ce navigateur.";

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

    speechAPI.setOnRecognitionResult(
        (event) => {
            document.body.style.transition = "background-color 0.4s ease-in-out";
            const spokenText = event.results[0][0].transcript.trim().normalize("NFC");
            const expectedText = data.elements[0].translations[selectedLanguage].toLowerCase().trim().normalize("NFC");

            if(spokenText === expectedText) {
                document.body.style.backgroundColor = "lightgreen";
                speechAPI.synth.cancel();
                speechAPI.setLanguage("fr");
                speechAPI.requestSynth("Bonne réponse !");
                setElements(shuffle(data.elements).slice(0, 1));
            }
            else {
                document.body.style.backgroundColor = "#FFCCCB";
            }

            setTimeout(
                () => {
                    document.body.style.backgroundColor = "white";
                }, 400
            )

            setDisplayedText(event.results[0][0].transcript);
        }
    )
    speechAPI.startRecognition();

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
            <Link href="/" onClick={() => {
                speechAPI.synth.cancel();
            }}>
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
                <Switch onChange={(checked) => setShowNames(checked)} checked={showNames}/>
            </label>
            <button style={{marginBottom: "10px"}} onClick={() => {
                speechAPI.synth.cancel();
                speechAPI.requestSynth(data?.elements[0].translations[selectedLanguage]);
            }}>
                Prononcer le mot
            </button>
            {gallery({
                gallery: data,
                styles: {gallery: styles.gallery, card: styles.card, image: {
                        width: "20vmax",
                        height: "20vmax",
                        borderRadius: "10px",
                        objectFit: "cover",
                    }},
                showNames: showNames,
                cardCount: 1,
                randomize: true,
                selectedLanguage: selectedLanguage,
            })}
            <input
                type="text"
                name="prononciation"
                placeholder={"Prononcez le mot"}
                size={40}
                readOnly={true}
                style={{marginTop: "20px"}}
                value={displayedText}
            />
        </div>
    );
}