package vocabquest.api.repository;

import vocabquest.api.model.ThemeData;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ThemeRepository extends MongoRepository<ThemeData, String> {
}
