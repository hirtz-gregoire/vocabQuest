package vocabquest.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "themes") // Collection MongoDB
public class ThemeData {

    @Id
    private String id;
    private String nameTheme; // 🔹 Maintenant un String et non une Map
    private String description; // 🔹 Ajout du champ description
    private List<String> availableLanguages;
    private List<ThemeElement> elements;

    // 🔹 Constructeur sans arguments (nécessaire pour MongoDB)
    public ThemeData() {}

    // 🔹 Constructeur avec arguments
    public ThemeData(String id, String nameTheme, String description, List<String> availableLanguages, List<ThemeElement> elements) {
        this.id = id;
        this.nameTheme = nameTheme;
        this.description = description;
        this.availableLanguages = availableLanguages;
        this.elements = elements;
    }

    // 🔹 Getters et Setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNameTheme() { return nameTheme; }
    public void setNameTheme(String nameTheme) { this.nameTheme = nameTheme; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getAvailableLanguages() { return availableLanguages; }
    public void setAvailableLanguages(List<String> availableLanguages) { this.availableLanguages = availableLanguages; }

    public List<ThemeElement> getElements() { return elements; }
    public void setElements(List<ThemeElement> elements) { this.elements = elements; }
}
