export interface WatchlistItem {
  id: string;
  movieId: string;
  title: string;
  posterUrl: string;
  userId: string | null;
  myRating: number | null;
  watched: boolean;
}
