package cinema.project.cinema.Controller;

import cinema.project.cinema.Model.Movie;
import cinema.project.cinema.Repository.MovieRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieRepository movieRepository;

    public MovieController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    // GET /api/movies — Get all movies (open to all)
    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieRepository.findAll());
    }

    // GET /api/movies/{id} — Get movie by ID (open to all)
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        return movieRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/movies — Create a new movie (ADMIN only)
    @PostMapping
    public ResponseEntity<?> createMovie(@RequestHeader(value = "X-User-Role", defaultValue = "") String role,
                                         @Valid @RequestBody Movie movie) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Admin only");
        }
        Movie saved = movieRepository.save(movie);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT /api/movies/{id} — Update movie by ID (ADMIN only)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMovie(@RequestHeader(value = "X-User-Role", defaultValue = "") String role,
                                         @PathVariable Long id,
                                         @Valid @RequestBody Movie updatedMovie) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Admin only");
        }
        return movieRepository.findById(id)
                .map(movie -> {
                    movie.setTitle(updatedMovie.getTitle());
                    movie.setGenre(updatedMovie.getGenre());
                    movie.setDuration(updatedMovie.getDuration());
                    movie.setDescription(updatedMovie.getDescription());
                    movie.setLanguage(updatedMovie.getLanguage());
                    movie.setRating(updatedMovie.getRating());
                    movie.setReleaseDate(updatedMovie.getReleaseDate());
                    movie.setPosterUrl(updatedMovie.getPosterUrl());
                    return ResponseEntity.ok((Object) movieRepository.save(movie));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/movies/{id} — Delete movie by ID (ADMIN only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@RequestHeader(value = "X-User-Role", defaultValue = "") String role,
                                         @PathVariable Long id) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Admin only");
        }
        if (!movieRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        movieRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
