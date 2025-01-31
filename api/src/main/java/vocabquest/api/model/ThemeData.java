package vocabquest.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "themes") // Collection MongoDB
public class ThemeData {
    @Id
    private String id;
    private Map<String, String> nameTheme; // 🌍 Stocke le nom du thème traduit dans plusieurs langues
    private List<String> availableLanguages;
    private List<ThemeElement> elements;

    public ThemeData() {}

    // 🔥 Constructeur mis à jour avec nameTheme sous forme de Map
    public ThemeData(String id, Map<String, String> nameTheme, List<String> availableLanguages, List<ThemeElement> elements) {
        this.id = id;
        this.nameTheme = nameTheme;
        this.availableLanguages = availableLanguages;
        this.elements = elements;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Map<String, String> getNameTheme() { return nameTheme; }
    public void setNameTheme(Map<String, String> nameTheme) { this.nameTheme = nameTheme; }

    public List<String> getAvailableLanguages() { return availableLanguages; }
    public void setAvailableLanguages(List<String> availableLanguages) { this.availableLanguages = availableLanguages; }

    public List<ThemeElement> getElements() { return elements; }
    public void setElements(List<ThemeElement> elements) { this.elements = elements; }
}
