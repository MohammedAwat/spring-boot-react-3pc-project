package cinema.project.cinema.Controller;

import cinema.project.cinema.Model.Showtime;
import cinema.project.cinema.Repository.MovieRepository;
import cinema.project.cinema.Repository.ShowtimeRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/showtimes")
public class ShowtimeController {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;

    public ShowtimeController(ShowtimeRepository showtimeRepository, MovieRepository movieRepository) {
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
    }

    // GET /api/showtimes — Get all showtimes (open to all)
    @GetMapping
    public ResponseEntity<List<Showtime>> getAllShowtimes() {
        return ResponseEntity.ok(showtimeRepository.findAll());
    }

    // GET /api/showtimes/{id} — Get showtimes by movie ID or showtime by ID (open to all)
    @GetMapping("/{id}")
    public ResponseEntity<?> getShowtimeById(@PathVariable Long id) {
        // First try to find as a single showtime
        var showtime = showtimeRepository.findById(id);
        if (showtime.isPresent()) {
            // Also check if there are showtimes for this movie ID
            List<Showtime> movieShowtimes = showtimeRepository.findByMovieId(id);
            if (!movieShowtimes.isEmpty()) {
                return ResponseEntity.ok(movieShowtimes);
            }
            return ResponseEntity.ok(showtime.get());
        }
        // Try as movie ID
        List<Showtime> movieShowtimes = showtimeRepository.findByMovieId(id);
        if (!movieShowtimes.isEmpty()) {
            return ResponseEntity.ok(movieShowtimes);
        }
        return ResponseEntity.notFound().build();
    }

    // POST /api/showtimes — Create a new showtime (ADMIN only)
    // Frontend sends: { movieId, date, time, hall, price, totalSeats }
    @PostMapping
    public ResponseEntity<?> createShowtime(@RequestHeader(value = "X-User-Role", defaultValue = "") String role,
                                            @RequestBody Map<String, Object> body) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Admin only");
        }

        Showtime showtime = new Showtime();
        showtime.setDate((String) body.get("date"));
        showtime.setTime((String) body.get("time"));
        showtime.setHall((String) body.get("hall"));
        showtime.setPrice(body.get("price") != null ? ((Number) body.get("price")).doubleValue() : null);
        showtime.setTotalSeats(body.get("totalSeats") != null ? ((Number) body.get("totalSeats")).intValue() : 100);

        // Link movie by ID
        Object movieIdObj = body.get("movieId");
        if (movieIdObj != null) {
            Long movieId = ((Number) movieIdObj).longValue();
            movieRepository.findById(movieId).ifPresent(showtime::setMovie);
        }

        Showtime saved = showtimeRepository.save(showtime);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // DELETE /api/showtimes/{id} — Delete showtime by ID (ADMIN only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShowtime(@RequestHeader(value = "X-User-Role", defaultValue = "") String role,
                                            @PathVariable Long id) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Admin only");
        }
        if (!showtimeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        showtimeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
