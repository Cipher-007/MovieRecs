export interface OMDBMovie {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: Array<{ Source: string; Value: string }>
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
  Error?: string
}

export async function fetchMovieByImdbId(imdbId: string): Promise<OMDBMovie | null> {
  const apiKey = process.env.OMDB_API_KEY
  
  if (!apiKey) {
    throw new Error('OMDB_API_KEY is not configured')
  }

  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbId}&plot=short`
  
  try {
    const response = await fetch(url)
    const data = await response.json() as OMDBMovie
    
    if (data.Response === 'False') {
      console.error('OMDB API Error:', data.Error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Failed to fetch movie from OMDB:', error)
    return null
  }
}

export interface OMDBSearchResult {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export interface OMDBSearchResponse {
  Search: OMDBSearchResult[]
  totalResults: string
  Response: string
  Error?: string
}

export async function searchMoviesByTitle(query: string): Promise<OMDBSearchResult[]> {
  const apiKey = process.env.OMDB_API_KEY
  
  if (!apiKey) {
    throw new Error('OMDB_API_KEY is not configured')
  }

  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}&type=movie`
  
  try {
    const response = await fetch(url)
    const data = await response.json() as OMDBSearchResponse
    
    if (data.Response === 'False') {
      return []
    }
    
    return data.Search || []
  } catch (error) {
    console.error('Failed to search movies from OMDB:', error)
    return []
  }
}
