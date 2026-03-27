import { db } from '../firebase/config'
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  writeBatch 
} from 'firebase/firestore'

const SONGS_COLLECTION = 'songs'
const VOTES_COLLECTION = 'userVotes'

/**
 * Adds a new song or increments votes if it exists.
 * Now limits to 3 songs per user.
 */
export const addOrVoteSong = async (song, uid) => {
  if (!uid) throw new Error('User UID required')

  // 1. Check user voting limit
  const userVoteRef = doc(db, VOTES_COLLECTION, uid)
  const userVoteSnap = await getDoc(userVoteRef)
  
  const currentVotes = userVoteSnap.exists() ? (userVoteSnap.data().votedSongs || []) : []
  
  if (currentVotes.length >= 3) {
    throw new Error('LIMIT_REACHED')
  }

  // Check if user already voted for THIS song
  if (currentVotes.includes(song.id)) {
    throw new Error('ALREADY_VOTED')
  }

  // 2. Perform Atomic Update (Song Vote + User Record)
  // Note: For a true atomic operation, use a runTransaction or writeBatch
  const batch = writeBatch(db)
  
  const songRef = doc(db, SONGS_COLLECTION, song.id)
  const songDoc = await getDoc(songRef)

  if (songDoc.exists()) {
    batch.update(songRef, { votes: increment(1) })
  } else {
    batch.set(songRef, {
      id: song.id,
      name: song.name,
      artist: song.artist,
      image: song.image,
      preview: song.preview,
      votes: 1,
      createdAt: serverTimestamp()
    })
  }

  // Update user record
  batch.set(userVoteRef, {
    votedSongs: [...currentVotes, song.id],
    lastVoteAt: serverTimestamp()
  }, { merge: true })

  return await batch.commit()
}

/**
 * Gets the number of votes already cast by a user.
 */
export const getUserVotes = async (uid) => {
  if (!uid) return []
  const userVoteSnap = await getDoc(doc(db, VOTES_COLLECTION, uid))
  return userVoteSnap.exists() ? (userVoteSnap.data().votedSongs || []) : []
}

/**
 * Real-time listener for top songs ranking.
 * @param {Function} callback - Function to handle the top songs list
 * @param {Number} topLimit - Number of songs to fetch
 */
export const listenToTopSongs = (callback, topLimit = 10) => {
  const q = query(
    collection(db, SONGS_COLLECTION), 
    orderBy('votes', 'desc'), 
    limit(topLimit)
  )

  return onSnapshot(q, (snapshot) => {
    const songs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(songs)
  })
}
