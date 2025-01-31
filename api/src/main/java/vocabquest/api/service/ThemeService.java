package vocabquest.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vocabquest.api.model.ThemeData;
import vocabquest.api.model.ThemeElement;
import vocabquest.api.repository.ThemeRepository;

import java.util.*;

@Service
public class ThemeService {

    @Autowired
    private ThemeRepository themeRepository;

    @Autowired
    private OpenAIService openAIService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // 🔹 Récupère tous les thèmes sans charger les éléments
    public List<ThemeData> getAllThemes() {
        return themeRepository.findAll().stream()
                .map(theme -> new ThemeData(theme.getId(), theme.getNameTheme(), theme.getAvailableLanguages(), null))
                .toList();
    }

    // 🔹 Recherche un thème par son ID
    public Optional<ThemeData> getThemeById(String id) {
        return themeRepository.findById(id);
    }

    // 🔥 Crée un thème en vérifiant d'abord avec OpenAI si le nom est valide
    public ThemeData createTheme(String nameTheme) {

        String generatedJson = openAIService.generateThemeJson(nameTheme);
        System.out.println("📌 JSON brut reçu d'OpenAI :\n" + generatedJson);

        try {
            JsonNode rootNode = objectMapper.readTree(generatedJson);
            Map<String, String> parsedNameTheme = new HashMap<>();
            rootNode.get("nameTheme").fields().forEachRemaining(entry ->
                    parsedNameTheme.put(entry.getKey(), entry.getValue().asText()));

            List<String> availableLanguages = new ArrayList<>();
            rootNode.get("availableLanguages").forEach(lang ->
                    availableLanguages.add(lang.asText()));

            List<ThemeElement> elements = new ArrayList<>();
            for (JsonNode elementNode : rootNode.get("elements")) {
                Map<String, String> translations = new HashMap<>();
                elementNode.get("translations").fields().forEachRemaining(entry ->
                        translations.put(entry.getKey(), entry.getValue().asText()));

                elements.add(new ThemeElement(new ArrayList<>(), translations));
            }

            ThemeData newTheme = new ThemeData(null, parsedNameTheme, availableLanguages, elements);
            return themeRepository.save(newTheme);

        } catch (Exception e) {
            throw new RuntimeException("❌ Erreur lors du parsing du JSON généré par OpenAI", e);
        }
    }
}
