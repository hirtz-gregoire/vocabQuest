package vocabquest.api.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import vocabquest.api.model.ThemeData;
import vocabquest.api.repository.ThemeRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Configuration
public class DataLoader {

    @Autowired
    private ThemeRepository themeRepository;

    @Bean
    @Profile("dev")
    public CommandLineRunner loadData() {
        return args -> {
            // Check if data already exists
            if (themeRepository.count() == 0) {
                System.out.println("Loading initial data into the database...");
                
                // Load animaux.json data
                try {
                    String animauxJson = new String(Files.readAllBytes(Paths.get("../client/public/data/animaux.json")));
                    ObjectMapper objectMapper = new ObjectMapper();
                    ThemeData animauxTheme = objectMapper.readValue(animauxJson, ThemeData.class);
                    
                    // Save to database
                    themeRepository.save(animauxTheme);
                    System.out.println("Successfully loaded 'Animaux' theme data");
                } catch (IOException e) {
                    System.err.println("Error loading animaux.json: " + e.getMessage());
                }
            } else {
                System.out.println("Database already contains data, skipping initial data load");
            }
        };
    }
}
