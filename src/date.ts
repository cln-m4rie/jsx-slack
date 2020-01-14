const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const ordinals = ['th', 'st', 'nd', 'rd']

const addOrdinal = (day: number) => {
  const v = day % 100
  return `${day}${ordinals[(v - 20) % 10] || ordinals[v] || ordinals[0]}`
}

export default function formatDate(date: Date, format: string) {
  const formattedDate = (short = false) => {
    let m = months[date.getMonth()]
    if (short) m = m.slice(0, 3)

    let d: number | string = date.getDate()
    if (!short) d = addOrdinal(d)

    return `${m} ${d}, ${date.getFullYear()}`
  }

  const formattedTime = (second = false) => {
    const h = `${date.getHours()}`.padStart(2, '0')
    const m = `${date.getMinutes()}`.padStart(2, '0')
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM'

    if (!second) return `${h}:${m} ${ampm}`

    const s = `${date.getSeconds()}`.padStart(2, '0')
    return `${h}:${m}:${s} ${ampm}`
  }

  const prettifiedDate = (camelize = false) => {
    const now = new Date()
    const ny = now.getFullYear()
    const nm = now.getMonth()
    const nd = now.getDate()

    const beginYesterday = new Date(ny, nm, nd - 1, 0, 0, 0).getTime()
    const beginToday = new Date(ny, nm, nd, 0, 0, 0).getTime()
    const beginTomorrow = new Date(ny, nm, nd + 1, 0, 0, 0).getTime()
    const endTomorrow = new Date(ny, nm, nd + 2, 0, 0, 0).getTime() - 1

    const unixtime = date.getTime()
    let ret = ''

    if (beginYesterday <= unixtime && unixtime < beginToday) ret = 'yesterday'
    if (beginToday <= unixtime && unixtime < beginTomorrow) ret = 'today'
    if (beginTomorrow <= unixtime && unixtime <= endTomorrow) ret = 'tomorrow'

    if (ret && camelize) ret = `${ret.slice(0, 1).toUpperCase()}${ret.slice(1)}`
    return ret
  }

  return format
    .replace(/{date_num}/g, () => {
      const y = `${date.getFullYear()}`.padStart(4, '0')
      const m = `${date.getMonth() + 1}`.padStart(2, '0')
      const d = `${date.getDate()}`.padStart(2, '0')

      return `${y}-${m}-${d}`
    })
    .replace(/{date_pretty}/g, (_, i) => prettifiedDate(i === 0) || '{date}')
    .replace(
      /{date_short_pretty}/g,
      (_, i) => prettifiedDate(i === 0) || '{date_short}'
    )
    .replace(
      /{date_long_pretty}/g,
      (_, i) => prettifiedDate(i === 0) || '{date_long}'
    )
    .replace(/{date}/g, () => formattedDate())
    .replace(/{date_short}/g, () => formattedDate(true))
    .replace(/{date_long}/g, () => `${days[date.getDay()]}, ${formattedDate()}`)
    .replace(/{time}/g, () => formattedTime())
    .replace(/{time_secs}/g, () => formattedTime(true))
}
