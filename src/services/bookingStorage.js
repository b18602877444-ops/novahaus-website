import { createBookingRecord, emptyBooking } from '../data/bookingSchema.js'

export const BOOKINGS_STORAGE_KEY = 'novahaus_bookings'

function readBookings() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]')
    const bookings = Array.isArray(parsed) ? parsed : parsed?.bookings
    return Array.isArray(bookings) ? bookings : []
  } catch {
    return []
  }
}

function writeBookings(bookings) {
  try {
    window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings))
    return true
  } catch {
    return false
  }
}

export function listBookings() {
  return readBookings().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
}

export function getBooking(id) {
  return listBookings().find((booking) => booking.id === id) || null
}

export function saveBooking(input) {
  const record = createBookingRecord(input)
  const bookings = readBookings()
  const index = bookings.findIndex((booking) => booking.id === record.id)
  if (index === -1) bookings.push(record); else bookings[index] = { ...bookings[index], ...record }
  return writeBookings(bookings) ? record : null
}

export function updateBooking(id, patch) {
  const current = getBooking(id)
  return current ? saveBooking({ ...current, ...patch, id }) : null
}

export function deleteBooking(id) {
  const bookings = readBookings().filter((booking) => booking.id !== id)
  writeBookings(bookings)
  return bookings
}

export function clearBookings() {
  try { window.localStorage.removeItem(BOOKINGS_STORAGE_KEY) } catch { /* Storage may be unavailable. */ }
}

export { emptyBooking }
