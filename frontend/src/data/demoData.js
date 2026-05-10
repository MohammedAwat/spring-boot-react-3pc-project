/**
 * Demo data — displayed as a fallback when the backend API is unreachable.
 * Posters are pulled from The Movie Database (TMDB) public image CDN.
 * When your Spring Boot server is running, real API data will replace these automatically.
 */

export const demoMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    genre: "Sci-Fi",
    duration: 166,
    language: "English",
    rating: 8.5,
    releaseDate: "2024-03-01",
    posterUrl: "https://image.tmdb.org/t/p/w500/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg",
    description:
      "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
  },
  {
    id: 2,
    title: "Oppenheimer",
    genre: "Biography",
    duration: 180,
    language: "English",
    rating: 8.9,
    releaseDate: "2023-07-21",
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    description:
      "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II. A gripping portrait of one of history's most enigmatic figures — the man who became the destroyer of worlds.",
  },
  {
    id: 3,
    title: "Interstellar",
    genre: "Sci-Fi",
    duration: 169,
    language: "English",
    rating: 8.7,
    releaseDate: "2014-11-07",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival. When Earth becomes uninhabitable, one father must leave everything behind to find a new home among the stars.",
  },
  {
    id: 4,
    title: "The Dark Knight",
    genre: "Action",
    duration: 152,
    language: "English",
    rating: 9.0,
    releaseDate: "2008-07-18",
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description:
      "When the menace known as The Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  },
  {
    id: 5,
    title: "Inception",
    genre: "Thriller",
    duration: 148,
    language: "English",
    rating: 8.8,
    releaseDate: "2010-07-16",
    posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. — but his world begins to unravel.",
  },
  {
    id: 6,
    title: "Avengers: Endgame",
    genre: "Action",
    duration: 181,
    language: "English",
    rating: 8.4,
    releaseDate: "2019-04-26",
    posterUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    description:
      "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to undo Thanos's actions and restore order to the universe.",
  },
  {
    id: 7,
    title: "The Godfather",
    genre: "Crime",
    duration: 175,
    language: "English",
    rating: 9.2,
    releaseDate: "1972-03-24",
    posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLLeAO0m7cIw.jpg",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son. An epic tale of power, loyalty, and family that redefined American cinema.",
  },
  {
    id: 8,
    title: "Gladiator II",
    genre: "Action",
    duration: 148,
    language: "English",
    rating: 7.2,
    releaseDate: "2024-11-22",
    posterUrl: "https://image.tmdb.org/t/p/w500/2cxhvwyE0RtuhmiZKgXGu9r35B5.jpg",
    description:
      "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome.",
  },
];

export const demoShowtimes = [
  { id: 101, movieId: 1, movieTitle: "Dune: Part Two",   date: "2026-05-07", time: "14:00", hall: "Hall A", price: 12.50, totalSeats: 100 },
  { id: 102, movieId: 1, movieTitle: "Dune: Part Two",   date: "2026-05-07", time: "19:30", hall: "Hall B", price: 15.00, totalSeats: 100 },
  { id: 103, movieId: 2, movieTitle: "Oppenheimer",       date: "2026-05-08", time: "16:00", hall: "Hall A", price: 12.50, totalSeats: 100 },
  { id: 104, movieId: 3, movieTitle: "Interstellar",      date: "2026-05-08", time: "20:00", hall: "IMAX",   price: 18.00, totalSeats: 80  },
  { id: 105, movieId: 4, movieTitle: "The Dark Knight",   date: "2026-05-09", time: "18:00", hall: "Hall C", price: 10.00, totalSeats: 120 },
  { id: 106, movieId: 5, movieTitle: "Inception",         date: "2026-05-09", time: "21:00", hall: "Hall B", price: 12.50, totalSeats: 100 },
  { id: 107, movieId: 6, movieTitle: "Avengers: Endgame", date: "2026-05-10", time: "15:00", hall: "IMAX",   price: 18.00, totalSeats: 80  },
  { id: 108, movieId: 7, movieTitle: "The Godfather",     date: "2026-05-10", time: "19:00", hall: "Hall A", price: 10.00, totalSeats: 100 },
];
