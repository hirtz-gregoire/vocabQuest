"use client";
import { useState } from "react";
import Link from "next/link";
import { styles } from "@/app/mode1/page";

export default function CreateThemePage() {
    const [themeName, setThemeName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [similarTheme, setSimilarTheme] = useState<{ name: string; description: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!themeName.trim()) {
            setError("Veuillez entrer un nom de thème");
            return;
        }

        setLoading(true);
        setError(null);
        setSimilarTheme(null);
        setSuccess(false);

        try {
            const response = await fetch("/api/themes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: themeName }),
            });

            if (!response.ok) {
                // Check if it's a conflict error (similar theme exists)
                if (response.status === 409) {
                    const data = await response.json();
                    setSimilarTheme({
                        name: data.similarThemeName,
                        description: data.similarThemeDescription,
                    });
                    setError("Un thème similaire existe déjà");
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } else {
                setSuccess(true);
                setThemeName("");
            }
        } catch (error) {
            setError(`Erreur lors de la création du thème: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <Link href="/">
                <img className={"return-button"} style={styles.return}
                     src={"https://cdn-icons-png.flaticon.com/512/6392/6392143.png"}/>
            </Link>
            <h1>Créer un nouveau thème</h1>
            <p>Entrez le nom du thème que vous souhaitez créer. Notre système générera automatiquement les traductions et les images correspondantes.</p>
            
            <form onSubmit={handleSubmit} style={formStyles.form}>
                <div style={formStyles.inputGroup}>
                    <label htmlFor="themeName" style={formStyles.label}>Nom du thème:</label>
                    <input
                        type="text"
                        id="themeName"
                        value={themeName}
                        onChange={(e) => setThemeName(e.target.value)}
                        placeholder="Ex: Animaux de la forêt, Instruments de musique, etc."
                        style={formStyles.input}
                        disabled={loading}
                    />
                </div>
                
                <button type="submit" style={formStyles.button} className="create-button" disabled={loading}>
                    {loading ? "Création en cours..." : "Créer le thème"}
                </button>
                
                {loading && (
                    <div style={formStyles.loadingContainer}>
                        <div style={formStyles.loadingSpinner}></div>
                        <p>Création du thème en cours... Cela peut prendre quelques instants pendant que nous générons les traductions et recherchons les images appropriées.</p>
                    </div>
                )}
                
                {error && <p style={formStyles.error}>{error}</p>}
                
                {similarTheme && (
                    <div style={formStyles.similarTheme}>
                        <h3>Thème similaire trouvé:</h3>
                        <p><strong>Nom:</strong> {similarTheme.name}</p>
                        <p><strong>Description:</strong> {similarTheme.description}</p>
                    </div>
                )}
                
                {success && (
                    <div style={formStyles.success}>
                        <h3>Thème créé avec succès!</h3>
                        <p>Votre nouveau thème a été créé et est maintenant disponible dans la liste des thèmes.</p>
                        <Link href="/mode1" style={formStyles.link} className="theme-link">
                            Voir tous les thèmes
                        </Link>
                    </div>
                )}
            </form>
        </div>
    );
}

const formStyles: Record<string, React.CSSProperties> = {
    form: {
        width: "100%",
        maxWidth: "700px",
        margin: "0 auto",
        padding: "30px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
        border: "1px solid #f0f0f0",
    },
    inputGroup: {
        marginBottom: "25px",
    },
    label: {
        display: "block",
        marginBottom: "10px",
        fontWeight: "600",
        color: "#333",
        fontSize: "16px",
    },
    input: {
        width: "100%",
        padding: "14px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        outline: "none",
    },
    button: {
        padding: "14px 28px",
        backgroundColor: "#4361ee",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
        boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
        letterSpacing: "0.5px",
    },
    error: {
        color: "#e53e3e",
        marginTop: "15px",
        padding: "12px 16px",
        backgroundColor: "#fff5f5",
        borderRadius: "8px",
        border: "1px solid #fed7d7",
        fontWeight: "500",
    },
    success: {
        backgroundColor: "#f0fff4",
        color: "#276749",
        padding: "20px",
        borderRadius: "8px",
        marginTop: "25px",
        border: "1px solid #c6f6d5",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    },
    similarTheme: {
        backgroundColor: "#fffaf0",
        color: "#7b341e",
        padding: "20px",
        borderRadius: "8px",
        marginTop: "25px",
        border: "1px solid #feebc8",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    },
    link: {
        display: "inline-block",
        marginTop: "15px",
        color: "#4361ee",
        textDecoration: "none",
        fontWeight: "600",
        padding: "8px 16px",
        borderRadius: "6px",
        transition: "background-color 0.2s ease",
    },
    loadingContainer: {
        marginTop: "30px",
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f7fafc",
        borderRadius: "8px",
    },
    loadingSpinner: {
        border: "4px solid rgba(0, 0, 0, 0.1)",
        borderLeft: "4px solid #4361ee",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        animation: "spin 1s linear infinite",
        margin: "0 auto 20px auto",
    },
};
