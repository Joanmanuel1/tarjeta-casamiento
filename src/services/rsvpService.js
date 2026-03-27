import { db } from '../firebase/config'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  writeBatch,
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore'

const GUESTS_COLLECTION = 'guests'

/**
 * Searches for guests whose search name starts with the given value.
 * @param {String} searchTerm - The prefix to search for
 */
export const searchGuests = async (searchTerm) => {
  if (!searchTerm || searchTerm.length < 3) return []

  const term = searchTerm.toLowerCase().trim()
  const guestsRef = collection(db, GUESTS_COLLECTION)
  
  // Prefix-based search in Firestore: >= term and <= term + \uf8ff
  const q = query(
    guestsRef, 
    where('nombreSearch', '>=', term),
    where('nombreSearch', '<=', term + '\uf8ff'),
    orderBy('nombreSearch'),
    limit(10)
  )
  
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

/**
 * Updates multiple guest RSVPs in a single batch.
 * @param {Array} responses - Array of { id, attendance, comments }
 */
export const updateMultipleRSVPs = async (responses) => {
  const batch = writeBatch(db)
  
  responses.forEach(({ id, attendance, comments }) => {
    const guestRef = doc(db, GUESTS_COLLECTION, id)
    batch.update(guestRef, {
      asistencia: attendance,
      comentario: comments,
      confirmadoEn: serverTimestamp(),
      estado: 'confirmado'
    })
  })
  
  return await batch.commit()
}
