import { db } from '../firebase/config'
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore'

const GUESTS_COLLECTION = 'guests'

/**
 * Fetch all guests ordered by name
 */
export const getGuests = async () => {
  const q = query(collection(db, GUESTS_COLLECTION), orderBy('nombre', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

/**
 * Add a new guest
 */
export const addGuest = async (guestData) => {
  const nombre = guestData.nombre || ''
  const apellido = guestData.apellido || ''
  const newGuest = {
    ...guestData,
    nombreSearch: `${nombre} ${apellido}`.trim().toLowerCase(),
    estado: guestData.estado || 'invitado',
    asistencia: guestData.asistencia || 'pendiente',
    comentario: guestData.comentario || '',
    confirmadoEn: null,
    createdAt: serverTimestamp()
  }
  
  const docRef = await addDoc(collection(db, GUESTS_COLLECTION), newGuest)
  return { id: docRef.id, ...newGuest }
}

/**
 * Update an existing guest
 */
export const updateGuest = async (id, guestData) => {
  const guestRef = doc(db, GUESTS_COLLECTION, id)
  const updateData = { ...guestData }
  
  const nombre = guestData.nombre || ''
  const apellido = guestData.apellido || ''
  updateData.nombreSearch = `${nombre} ${apellido}`.trim().toLowerCase()
  
  await updateDoc(guestRef, updateData)
  return { id, ...updateData }
}

/**
 * Delete a guest
 */
export const deleteGuest = async (id) => {
  const guestRef = doc(db, GUESTS_COLLECTION, id)
  await deleteDoc(guestRef)
  return id
}
