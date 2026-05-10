package cinema.project.cinema.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "showtimes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Showtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date;

    private String time;

    private String hall;

    private Double price;

    private Integer totalSeats;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @OneToMany(mappedBy = "showtime", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Ticket> tickets;

    // Transient fields for frontend compatibility
    @Transient
    private Long movieId;

    @Transient
    private String movieTitle;

    @PostLoad
    private void fillTransientFields() {
        if (movie != null) {
            this.movieId = movie.getId();
            this.movieTitle = movie.getTitle();
        }
    }
}
