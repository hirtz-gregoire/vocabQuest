package vocabquest.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class OpenAIService {

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String apiKey;

    public OpenAIService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        Dotenv dotenv = Dotenv.load();
        this.apiKey = dotenv.get("OPENAI_API_KEY");
    }

    public String generateThemeJson(String theme) {
        try {

            String prompt = """
            Génère un JSON contenant environ 30 éléments basés sur le thème suivant : %s.
            Tu dois formater "nameTheme" pour qu'il soit **prêt à être affiché sur un site web** :
            - **Utilise des espaces** (pas d'underscores _)
            - **Capitalise chaque mot** (ex: "Animaux de la Ferme")
            - **Ajoute des emojis pertinents** si cela s'y prête (ex: "🐶 Animaux de Compagnie", "🍽 Cuisine du Monde")
            - **Ne mets PAS d'emoji si cela ne fait pas sens**.

            Chaque élément doit inclure un champ "translations" qui contient le nom de l'élément traduit dans les langues suivantes :
            - Français (fr)
            - Anglais (en)
            - Espagnol (es)
            - Italien (it)
            - Allemand (de)
            - Japonais (ja)
            - Chinois (zh)

            Le JSON doit être structuré ainsi :
            {
              "nameTheme": {
                "fr": "Nom du thème en français",
                "en": "Theme name in English",
                "es": "Nombre del tema en español",
                "it": "Nome del tema in italiano",
                "de": "Thema Name auf Deutsch",
                "ja": "テーマ名（日本語）",
                "zh": "主题名称（中文）"
              },
              "availableLanguages": ["fr", "en", "es", "it", "de", "ja", "zh"],
              "elements": [
                {
                  "urls": [],
                  "translations": {
                    "fr": "Exemple",
                    "en": "Example",
                    "es": "Ejemplo",
                    "it": "Esempio",
                    "de": "Beispiel",
                    "ja": "例",
                    "zh": "例子"
                  }
                }
              ]
            }

            Génère environ 20 éléments en respectant strictement cette structure.
            Assure-toi que les traductions sont **exactes et naturelles** dans chaque langue.
            Ne mets **aucun lien d’image** dans la réponse, mais garde le champ "urls" vide.
            **Ne mets que du JSON valide, rien d’autre !**
            """.formatted(theme);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.put("messages", new Object[]{
                    Map.of("role", "system", "content", "Tu es un assistant expert en génération de JSON."),
                    Map.of("role", "user", "content", prompt)
            });
            requestBody.put("max_tokens", 3000);
            requestBody.put("temperature", 0.7);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(OPENAI_URL, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                return jsonResponse.get("choices").get(0).get("message").get("content").asText();
            } else {
                throw new RuntimeException("Erreur OpenAI: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'appel à OpenAI", e);
        }
    }
}