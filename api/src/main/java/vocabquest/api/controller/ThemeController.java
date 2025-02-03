package vocabquest.api.controller;

import org.springframework.http.HttpStatus;
import vocabquest.api.model.ThemeData;
import vocabquest.api.service.ThemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/themes")
public class ThemeController {

    @Autowired
    private ThemeService themeService;

    @GetMapping
    public List<ThemeData> getAllThemes() {
        return themeService.getAllThemes();
    }

    @GetMapping("/{id}")
    public Optional<ThemeData> getThemeById(@PathVariable String id) {
        return themeService.getThemeById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ThemeData createTheme(@RequestBody String userRequest) {
        return themeService.createTheme(userRequest);
    }
}
