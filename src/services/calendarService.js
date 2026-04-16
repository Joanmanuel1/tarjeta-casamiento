/**
 * Genera y descarga un archivo .ics compatible con Google Calendar,
 * Apple Calendar y Outlook.
 *
 * Los horarios están en UTC (Argentina = UTC-3):
 *   Civil  11:30 AR → 14:30 UTC
 *   Fiesta 18:00 AR → 21:00 UTC (termina ~03:00 AR → 06:00 UTC del día siguiente)
 */

const EVENTS = [
  {
    uid: 'civil-joan-stephie-20271106@wedding',
    summary: 'Civil – Joan & Stephie 💍',
    description: 'Ceremonia Civil\\nRegistro Civil Temperley\\nLiniers 155\\, Lomas de Zamora\\, PBA',
    location: 'Registro Civil Temperley\\, Liniers 155\\, Lomas de Zamora\\, Buenos Aires',
    dtstart: '20271106T143000Z',  // 11:30 ART = 14:30 UTC
    dtend:   '20271106T163000Z',  // ~13:30 ART = 16:30 UTC (2 hs)
  },
  {
    uid: 'fiesta-joan-stephie-20271106@wedding',
    summary: 'Fiesta – Joan & Stephie 🎉',
    description: '¡La Fiesta!\\nQuinta "Los Cipreses"\\n25 de Mayo 1696\\, Ministro Rivadavia\\, PBA\\n\\nRecomendamos usar Av. Espora y luego 25 de Mayo (todo asfaltado).',
    location: 'Quinta Los Cipreses\\, 25 de Mayo 1696\\, Ministro Rivadavia\\, Buenos Aires',
    dtstart: '20271106T210000Z',  // 18:00 ART = 21:00 UTC
    dtend:   '20271107T060000Z',  // ~03:00 ART del día siguiente = 06:00 UTC
  },
]

function formatLine(key, value) {
  // RFC 5545: líneas de max 75 bytes, continuar con espacio al inicio
  const line = `${key}:${value}`
  if (line.length <= 75) return line
  const chunks = []
  let i = 0
  chunks.push(line.slice(0, 75))
  i = 75
  while (i < line.length) {
    chunks.push(' ' + line.slice(i, i + 74))
    i += 74
  }
  return chunks.join('\r\n')
}

function buildICS(events) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Joan & Stephie Wedding//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ]

  for (const ev of events) {
    lines.push(
      'BEGIN:VEVENT',
      formatLine('UID', ev.uid),
      formatLine('DTSTAMP', stamp),
      formatLine('DTSTART', ev.dtstart),
      formatLine('DTEND', ev.dtend),
      formatLine('SUMMARY', ev.summary),
      formatLine('DESCRIPTION', ev.description),
      formatLine('LOCATION', ev.location),
      'END:VEVENT',
    )
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

/**
 * Descarga un .ics con los dos eventos del casamiento.
 * @param {'both'|'civil'|'fiesta'} which
 */
export function downloadCalendar(which = 'both') {
  const eventsToInclude = which === 'civil'
    ? [EVENTS[0]]
    : which === 'fiesta'
      ? [EVENTS[1]]
      : EVENTS

  const icsContent = buildICS(eventsToInclude)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = which === 'civil'
    ? 'civil-joan-stephie.ics'
    : which === 'fiesta'
      ? 'fiesta-joan-stephie.ics'
      : 'casamiento-joan-stephie.ics'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
