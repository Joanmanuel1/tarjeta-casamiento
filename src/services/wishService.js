import { db } from '../firebase/config'
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  limit
} from 'firebase/firestore'

const WISHES_COLLECTION = 'wishes'

/**
 * Agrega un deseo nuevo.
 * @param {{ nombre: string, mensaje: string }} data
 */
export const addWish = async ({ nombre, mensaje }) => {
  const docRef = await addDoc(collection(db, WISHES_COLLECTION), {
    nombre: nombre.trim(),
    mensaje: mensaje.trim(),
    creadoEn: serverTimestamp()
  })
  return docRef.id
}

/**
 * Obtiene todos los deseos (lectura única, para el admin).
 */
export const getWishes = async () => {
  const q = query(collection(db, WISHES_COLLECTION), orderBy('creadoEn', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Suscripción en tiempo real a los deseos (para el muro público).
 * @param {function} callback  Recibe el array de deseos
 * @returns función para cancelar la suscripción
 */
export const subscribeToWishes = (callback) => {
  const q = query(
    collection(db, WISHES_COLLECTION),
    orderBy('creadoEn', 'desc'),
    limit(50)
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}
