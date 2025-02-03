package vocabquest.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 🔥 Gère l'erreur spécifique `ThemeConflictException` (409 Conflict)
    @ExceptionHandler(ThemeConflictException.class)
    public ResponseEntity<Map<String, Object>> handleThemeConflictException(ThemeConflictException ex, WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.CONFLICT.value());
        body.put("error", "Theme Conflict");
        body.put("path", request.getDescription(false).replace("uri=", ""));
        body.put("message", "Le thème proposé est trop proche d'un thème existant.");

        // 🆕 Ajout du nom et de la description du thème en conflit
        body.put("similarThemeName", ex.getThemeName());
        body.put("similarThemeDescription", ex.getThemeDescription());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }
}
