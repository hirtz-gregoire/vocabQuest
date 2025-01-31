package vocabquest.api.model;

import java.util.List;
import java.util.Map;

public class ThemeElement {
    private List<String> urls;
    private Map<String, String> translations; // clé: langue, valeur: traduction

    public ThemeElement() {}

    public ThemeElement(List<String> urls, Map<String, String> translations) {
        this.urls = urls;
        this.translations = translations;
    }

    public List<String> getUrls() { return urls; }
    public void setUrls(List<String> urls) { this.urls = urls; }

    public Map<String, String> getTranslations() { return translations; }
    public void setTranslations(Map<String, String> translations) { this.translations = translations; }
}
