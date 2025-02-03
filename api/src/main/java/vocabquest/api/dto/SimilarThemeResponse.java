package vocabquest.api.dto;

public class SimilarThemeResponse {
    private boolean isSimilar;
    private String similarThemeName;
    private String similarThemeDescription;

    public SimilarThemeResponse() {}

    public SimilarThemeResponse(boolean isSimilar, String similarThemeName, String similarThemeDescription) {
        this.isSimilar = isSimilar;
        this.similarThemeName = similarThemeName;
        this.similarThemeDescription = similarThemeDescription;
    }

    public boolean isSimilar() {
        return isSimilar;
    }

    public void setSimilar(boolean similar) {
        isSimilar = similar;
    }

    public String getSimilarThemeName() {
        return similarThemeName;
    }

    public void setSimilarThemeName(String similarThemeName) {
        this.similarThemeName = similarThemeName;
    }

    public String getSimilarThemeDescription() {
        return similarThemeDescription;
    }

    public void setSimilarThemeDescription(String similarThemeDescription) {
        this.similarThemeDescription = similarThemeDescription;
    }
}
