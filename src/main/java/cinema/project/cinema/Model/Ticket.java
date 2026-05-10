package cinema.project.cinema.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seatNumber;

    private String status;

    private String customerName;

    private String customerEmail;

    private String customerPhone;

    private Double totalPrice;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "showtime_id")
    private Showtime showtime;

    // Transient fields for frontend display
    @Transient
    private Long showtimeId;

    @Transient
    private String movieTitle;

    @Transient
    private String showDate;

    @Transient
    private String showTime;

    @Transient
    private Double price;

    @PostLoad
    private void fillTransientFields() {
        if (showtime != null) {
            this.showtimeId = showtime.getId();
            this.showDate = showtime.getDate();
            this.showTime = showtime.getTime();
            this.price = showtime.getPrice();
            if (showtime.getMovie() != null) {
                this.movieTitle = showtime.getMovie().getTitle();
            }
        }
    }
}
