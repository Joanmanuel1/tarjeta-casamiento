/**
 * Music Search Service using iTunes API.
 * This replaces Spotify to avoid CORS issues and the need for a backend/keys.
 */

export const searchTracks = async (query) => {
  if (!query || query.length < 3) return []

  try {
    // iTunes API is public, no keys needed, supports CORS
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=10`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('iTunes API error')

    const data = await response.json()
    
    return data.results.map(track => ({
      id: track.trackId.toString(), // We use trackId as unique ID
      name: track.trackName,
      artist: track.artistName,
      image: track.artworkUrl100.replace('100x100', '300x300'), // Get a higher res image
      preview: track.previewUrl,
      uri: track.trackViewUrl // Link to Apple Music instead of Spotify
    }))
  } catch (error) {
    console.error('Music Search error (iTunes):', error)
    return []
  }
}
