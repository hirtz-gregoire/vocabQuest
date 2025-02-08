package vocabquest.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vocabquest.api.dto.SimilarThemeResponse;
import vocabquest.api.exception.ThemeConflictException;
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
    @Autowired
    private PexelsAIService pexelsAIService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 🔹 Récupère tous les thèmes sans charger les éléments
    public List<ThemeData> getAllThemes() {
        return themeRepository.findAll().stream()
                .map(theme -> new ThemeData(
                        theme.getId(),
                        theme.getNameTheme(),
                        theme.getDescription(),
                        theme.getAvailableLanguages(),
                        null
                ))
                .toList();
    }


    // 🔹 Recherche un thème par son ID
    public Optional<ThemeData> getThemeById(String id) {
        return themeRepository.findById(id);
    }

    // 🔥 Crée un thème en vérifiant d'abord avec OpenAI si le nom est valide
    public ThemeData createTheme(String nameTheme) {

        List<ThemeData> existingThemes = themeRepository.findAll();

        if (!existingThemes.isEmpty()){
            SimilarThemeResponse similarityResponse = openAIService.checkThemeSimilarity(nameTheme, existingThemes);

            if (similarityResponse.isSimilar()) {
                throw new ThemeConflictException(
                        similarityResponse.getSimilarThemeName(),
                        similarityResponse.getSimilarThemeDescription()
                );
            }
        }

        String generatedJson = openAIService.generateThemeJson(nameTheme);
        System.out.println("📌 JSON brut reçu d'OpenAI :\n" + generatedJson);

        try {
            JsonNode rootNode = objectMapper.readTree(generatedJson);

            String parsedNameTheme = rootNode.get("nameTheme").asText();
            String description = rootNode.has("description") ? rootNode.get("description").asText() : "";

            List<String> availableLanguages = new ArrayList<>();
            rootNode.get("availableLanguages").forEach(lang -> availableLanguages.add(lang.asText()));

            List<ThemeElement> elements = new ArrayList<>();
            for (JsonNode elementNode : rootNode.get("elements")) {
                Map<String, String> translations = new HashMap<>();
                elementNode.get("translations").fields().forEachRemaining(entry ->
                        translations.put(entry.getKey(), entry.getValue().asText()));

                // On utilise la traduction en français comme requête pour l'API Pexels
                String query = translations.get("en");
                List<String> imageUrls = pexelsAIService.searchImages(query);

                // Création de l'élément avec les URLs récupérées
                elements.add(new ThemeElement(imageUrls, translations));
            }

            // Création et sauvegarde du thème
            ThemeData newTheme = new ThemeData(null, parsedNameTheme, description, availableLanguages, elements);
            return themeRepository.save(newTheme);

        } catch (Exception e) {
            throw new RuntimeException("❌ Erreur lors du parsing du JSON généré par OpenAI", e);
        }
    }
}