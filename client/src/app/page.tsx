import Link from "next/link";

export default function HomePage() {

    return (
        <div style={styles.container}>
            <h1>Bienvenue sur vocabQuest !</h1>
            <p>Apprendre les langues en s&#39;amusant</p>
            <div style={styles.buttons}>
                <Link href="/mode1" style={styles.button}>Galerie</Link>
                <Link href="/mode1" style={styles.button}>Compréhension (todo)</Link>
                <Link href="/mode1" style={styles.button}>Prononciation (todo)</Link>
                <Link href="/mode1" style={redButton}>Paramètres audio (todo)</Link>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        textAlign: "center",
        padding: "50px",
    },
    buttons: {
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        marginTop: "20px",
    },
    button: {
        padding: "10px 20px",
        fontSize: "18px",
        cursor: "pointer",
        backgroundColor: "#0070f3",
        color: "white",
        border: "none",
        borderRadius: "5px",
        textDecoration: "none",
        display: "inline-block",
    }
};

const redButton = {
    ...styles.button,
    backgroundColor: "#00c6f3",
    color:"black"
}