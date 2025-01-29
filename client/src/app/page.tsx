import Link from "next/link";

export default function HomePage() {
    return (
        <div style={styles.container}>
            <h1>Bienvenue sur mon application</h1>
            <div style={styles.buttons}>
                <Link href="/mode1" style={styles.button}>Mode 1 - Galerie</Link>
                <button style={styles.button} disabled>Mode 2 - (À venir)</button>
                <button style={styles.button} disabled>Mode 3 - (À venir)</button>
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
