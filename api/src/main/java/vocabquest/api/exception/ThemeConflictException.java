package vocabquest.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT) // Renvoie un code 409 Conflict automatiquement
public class ThemeConflictException extends RuntimeException {
    private final String themeName;
    private final String themeDescription;

    public ThemeConflictException(String themeName, String themeDescription) {
        super("Le thème proposé est trop proche d'un thème existant.");
        this.themeName = themeName;
        this.themeDescription = themeDescription;
    }

    public String getThemeName() {
        return themeName;
    }

    public String getThemeDescription() {
        return themeDescription;
    }
}
