package cinema.project.cinema.Controller;

import cinema.project.cinema.Model.Ticket;
import cinema.project.cinema.Repository.ShowtimeRepository;
import cinema.project.cinema.Repository.TicketRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketRepository ticketRepository;
    private final ShowtimeRepository showtimeRepository;

    public TicketController(TicketRepository ticketRepository, ShowtimeRepository showtimeRepository) {
        this.ticketRepository = ticketRepository;
        this.showtimeRepository = showtimeRepository;
    }

    // GET /api/tickets — Get all tickets (ADMIN only)
    @GetMapping
    public ResponseEntity<?> getAllTickets(@RequestHeader(value = "X-User-Role", defaultValue = "ADMIN") String role) {
        return ResponseEntity.ok(ticketRepository.findAll());
    }

    // GET /api/tickets/{id} — Get ticket by ID (open to all)
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ticketRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/tickets/showtime/{showtimeId} — Get tickets for a showtime (for seat availability)
    @GetMapping("/showtime/{showtimeId}")
    public ResponseEntity<List<Ticket>> getTicketsByShowtime(@PathVariable Long showtimeId) {
        return ResponseEntity.ok(ticketRepository.findByShowtimeId(showtimeId));
    }

    // POST /api/tickets — Book ticket(s)
    // Frontend sends: { showtimeId, customerName, customerEmail, customerPhone, seats: ["A1","A2"] }
    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody Map<String, Object> body) {
        Object showtimeIdObj = body.get("showtimeId");
        String customerName = (String) body.get("customerName");
        String customerEmail = (String) body.get("customerEmail");
        String customerPhone = (String) body.get("customerPhone");

        if (showtimeIdObj == null) {
            return ResponseEntity.badRequest().body("showtimeId is required");
        }

        Long showtimeId = ((Number) showtimeIdObj).longValue();
        var showtimeOpt = showtimeRepository.findById(showtimeId);
        if (showtimeOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Showtime not found");
        }

        var showtime = showtimeOpt.get();
        List<Ticket> savedTickets = new ArrayList<>();

        // Handle seats array from frontend
        Object seatsObj = body.get("seats");
        if (seatsObj instanceof List<?> seatsList) {
            double pricePerSeat = showtime.getPrice() != null ? showtime.getPrice() : 0;
            for (Object seat : seatsList) {
                Ticket ticket = new Ticket();
                ticket.setSeatNumber(String.valueOf(seat));
                ticket.setStatus("CONFIRMED");
                ticket.setCustomerName(customerName);
                ticket.setCustomerEmail(customerEmail);
                ticket.setCustomerPhone(customerPhone);
                ticket.setTotalPrice(pricePerSeat);
                ticket.setShowtime(showtime);
                savedTickets.add(ticketRepository.save(ticket));
            }
        } else {
            // Single seat
            String seatNumber = (String) body.get("seatNumber");
            Ticket ticket = new Ticket();
            ticket.setSeatNumber(seatNumber != null ? seatNumber : "A1");
            ticket.setStatus("CONFIRMED");
            ticket.setCustomerName(customerName);
            ticket.setCustomerEmail(customerEmail);
            ticket.setCustomerPhone(customerPhone);
            ticket.setTotalPrice(showtime.getPrice());
            ticket.setShowtime(showtime);
            savedTickets.add(ticketRepository.save(ticket));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedTickets);
    }

    // DELETE /api/tickets/{id} — Delete ticket by ID (ADMIN only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@RequestHeader(value = "X-User-Role", defaultValue = "") String role,
                                          @PathVariable Long id) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Admin only");
        }
        if (!ticketRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ticketRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
