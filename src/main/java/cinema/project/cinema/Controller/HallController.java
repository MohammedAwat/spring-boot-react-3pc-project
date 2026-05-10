package cinema.project.cinema.Controller;

import cinema.project.cinema.Model.Hall;
import cinema.project.cinema.Repository.HallRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/halls")
public class HallController {

    private final HallRepository hallRepository;

    public HallController(HallRepository hallRepository) {
        this.hallRepository = hallRepository;
    }

    // GET /api/halls — Get all halls (open to all)
    @GetMapping
    public ResponseEntity<List<Hall>> getAllHalls() {
        return ResponseEntity.ok(hallRepository.findAll());
    }

    // GET /api/halls/{id} — Get hall by ID (open to all)
    @GetMapping("/{id}")
    public ResponseEntity<Hall> getHallById(@PathVariable Long id) {
        return hallRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/halls — Create a new hall (ADMIN only)
    @PostMapping
    public ResponseEntity<?> createHall(@RequestHeader(value = "X-User-Role", defaultValue = "") String role,
                                        @Valid @RequestBody Hall hall) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Admin only");
        }
        Hall saved = hallRepository.save(hall);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT /api/halls/{id} — Update hall by ID (ADMIN only)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateHall(@RequestHeader(value = "X-User-Role", defaultValue = "") String role,
                                        @PathVariable Long id,
                                        @Valid @RequestBody Hall updatedHall) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Admin only");
        }
        return hallRepository.findById(id)
                .map(hall -> {
                    hall.setName(updatedHall.getName());
                    hall.setCapacity(updatedHall.getCapacity());
                    return ResponseEntity.ok((Object) hallRepository.save(hall));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/halls/{id} — Delete hall by ID (ADMIN only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHall(@RequestHeader(value = "X-User-Role", defaultValue = "") String role,
                                        @PathVariable Long id) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Admin only");
        }
        if (!hallRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        hallRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
