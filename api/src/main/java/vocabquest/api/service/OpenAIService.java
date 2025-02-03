    package vocabquest.api.service;
    
    import com.fasterxml.jackson.databind.JsonNode;
    import com.fasterxml.jackson.databind.ObjectMapper;
    import io.github.cdimascio.dotenv.Dotenv;
    import org.springframework.http.*;
    import org.springframework.stereotype.Service;
    import org.springframework.web.client.RestTemplate;
    import vocabquest.api.dto.SimilarThemeResponse;
    import vocabquest.api.model.ThemeData;
    
    import java.util.HashMap;
    import java.util.List;
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
    
        public SimilarThemeResponse checkThemeSimilarity(String userInput, List<ThemeData> existingThemes) {
            try {
                // 1️⃣ Construction de la liste des thèmes existants avec leurs descriptions
                StringBuilder existingThemesText = new StringBuilder();
                for (ThemeData theme : existingThemes) {
                    existingThemesText.append("- **Nom**: ")
                            .append(theme.getNameTheme())
                            .append("\n  **Description**: ")
                            .append(theme.getDescription())
                            .append("\n");
                }
    
                // 2️⃣ Construction du prompt amélioré
                String prompt = """
            Voici une liste de thèmes existants avec leurs descriptions :
            
            %s
    
            Un utilisateur souhaite créer un nouveau thème en entrant le texte suivant :
            "%s"
    
            🚨 Analyse la demande et détermine si elle est **vraiment** similaire à un des thèmes existants en respectant ces critères :
            
            ✅ Considère que la demande est **similaire** **seulement si** :
            - **Le sens général** est **quasiment identique** à un thème existant.
            - Le texte contient **des synonymes ou paraphrases proches** du **nom du thème** **et** de sa **description**.
            - Le thème existant et la demande couvrent **le même sujet avec les mêmes objectifs**.
    
            ❌ **Ne considère PAS comme similaire** si :
            - **La requête est trop vague** ou trop différente du sens du thème.
            - Il y a une simple **proximité lexicale** (ex: "Forêt tropicale" ≠ "Forêt enchantée").
            - **Les concepts sont trop généraux** (ex: "Animaux" ≠ "Animaux de la ferme").
            - L'utilisateur donne **un texte large** qui pourrait englober plusieurs thèmes existants.
            - La requête parle **d'un sous-thème spécifique d'un thème existant**, sans recouvrir l’intégralité du concept.
            
            🔹 Si la demande correspond **vraiment** à un des thèmes existants, retourne **uniquement** ce JSON :
            ```json
            {
              "isSimilar": true,
              "similarThemeName": "Nom exact du thème jugé similaire",
              "similarThemeDescription": "Description exacte du thème jugé similaire"
            }
            ```
            
            🔹 Sinon, retourne **uniquement** ce JSON :
            ```json
            {
              "isSimilar": false
            }
            ```
            
            **IMPORTANT :**
            - **Ne retourne QUE du JSON valide**, sans texte supplémentaire ou markdow
            - **Si plusieurs thèmes sont proches, choisis le plus pertinent.**
            - **Ne crée pas un nouveau thème, ne propose pas de corrections.**
            """.formatted(existingThemesText.toString(), userInput);
    
                // 3️⃣ Préparation de la requête OpenAI
                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("model", "gpt-4");
                requestBody.put("messages", new Object[]{
                        Map.of("role", "system", "content", "Tu es un assistant expert en détection de similarités entre textes."),
                        Map.of("role", "user", "content", prompt)
                });
                requestBody.put("max_tokens", 300);
                requestBody.put("temperature", 0.1); // Température basse pour éviter des erreurs d'interprétation
    
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Authorization", "Bearer " + apiKey);
    
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
                ResponseEntity<String> response = restTemplate.exchange(OPENAI_URL, HttpMethod.POST, entity, String.class);
    
                if (response.getStatusCode() == HttpStatus.OK) {
                    //System.out.println("Réponse OpenAI : " + response.getBody());
                    JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                    String assistantAnswer = jsonResponse.get("choices").get(0).get("message").get("content").asText();
                    assistantAnswer = assistantAnswer.replaceAll("^```json\\s*", "").replaceAll("\\s*```$", "");

    
                    // 4️⃣ Parsing de la réponse JSON
                    JsonNode node = objectMapper.readTree(assistantAnswer);
                    boolean isSimilar = node.get("isSimilar").asBoolean();
                    String similarThemeName = isSimilar && node.has("similarThemeName")
                            ? node.get("similarThemeName").asText()
                            : null;
                    String similarThemeDescription = isSimilar && node.has("similarThemeDescription")
                            ? node.get("similarThemeDescription").asText()
                            : null;
    
                    return new SimilarThemeResponse(isSimilar, similarThemeName, similarThemeDescription);
    
                } else {
                    throw new RuntimeException("Erreur OpenAI: " + response.getBody());
                }
            } catch (Exception e) {
                throw new RuntimeException("Erreur lors de l'appel à OpenAI (checkThemeSimilarity)", e);
            }
        }
    
    
    
        public String generateThemeJson(String theme) {
            try {
    
                String prompt = """
                Génère un JSON contenant environ 30 éléments basés sur le thème suivant : %s.
                Tu dois formater "nameTheme" pour qu'il soit **prêt à être affiché sur un site web** :
                - **Utilise des espaces** (pas d'underscores _)
                - **Capitalise chaque mot** (ex: "Animaux de la Ferme")
    
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
                  "nameTheme": "Nom du thème en français",
                  "description": "Description du thème",
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