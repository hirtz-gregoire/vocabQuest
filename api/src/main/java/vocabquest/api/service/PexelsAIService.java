package vocabquest.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class PexelsAIService {

    private static final String PEXELS_API_URL = "https://api.pexels.com/v1/search";
    private final String apiKey;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public PexelsAIService() {
        Dotenv dotenv = Dotenv.load();
        this.apiKey = dotenv.get("PEXELS_API_KEY");
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Recherche des images sur Pexels correspondant à la requête donnée.
     * Ici, nous limitons le résultat à 3 images (modifiable via le paramètre per_page).
     *
     * @param query le texte servant de requête (exemple : le nom d’un élément en français)
     * @return une liste d’URLs d’images (ex. : le lien vers la version "medium")
     */
    public List<String> searchImages(String query) {
        try {
            // On encode la query et on limite à 3 résultats (modifiable)
            String url = PEXELS_API_URL + "?query=" + URLEncoder.encode(query, StandardCharsets.UTF_8) + "&per_page=3";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiKey);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            if(response.getStatusCode() == HttpStatus.OK) {
                JsonNode root = objectMapper.readTree(response.getBody());
                List<String> urls = new ArrayList<>();
                // Parcours du tableau "photos" pour récupérer la version "medium" de chaque image
                for (JsonNode photo : root.get("photos")) {
                    String imageUrl = photo.get("src").get("medium").asText();
                    urls.add(imageUrl);
                }
                return urls;
            } else {
                throw new RuntimeException("Erreur Pexels: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'appel à l'API Pexels", e);
        }
    }
}
