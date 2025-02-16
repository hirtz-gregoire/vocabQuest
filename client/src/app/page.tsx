import Link from "next/link";

export default function HomePage() {

    return (
        <div style={styles.container}>
            <h1>Bienvenue sur vocabQuest !</h1>
            <p>Apprendre les langues en s&#39;amusant</p>
            <div style={styles.buttons}>
                <Link href="/mode1" style={styles.button} className="main-button">Galerie</Link>
                <Link href="/mode2" style={styles.button} className="main-button">Compréhension</Link>
                <Link href="/mode3" style={styles.button} className="main-button">Prononciation</Link>
            </div>
            <div style={styles.adminSection}>
                <h3>Administration</h3>
                <Link href="/create-theme" style={styles.adminButton} className="admin-button">Créer un nouveau thème</Link>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        textAlign: "center",
        padding: "50px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(to bottom, #ffffff, #f5f5f5)",
        minHeight: "100vh",
    },
    buttons: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "30px",
        flexWrap: "wrap",
    },
    button: {
        padding: "15px 30px",
        fontSize: "18px",
        cursor: "pointer",
        backgroundColor: "#4361ee",
        color: "white",
        border: "none",
        borderRadius: "8px",
        textDecoration: "none",
        display: "inline-block",
        boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        fontWeight: "600",
        letterSpacing: "0.5px"
    },
    adminSection: {
        marginTop: "70px",
        padding: "30px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        maxWidth: "700px",
        margin: "70px auto 0",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
        border: "1px solid #f0f0f0",
    },
    adminButton: {
        padding: "12px 25px",
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: "#10b981",
        color: "white",
        border: "none",
        borderRadius: "8px",
        textDecoration: "none",
        display: "inline-block",
        marginTop: "15px",
        boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        fontWeight: "500"
    }
};

const redButton = {
    ...styles.button,
    backgroundColor: "#00c6f3",
    color:"black"
}
