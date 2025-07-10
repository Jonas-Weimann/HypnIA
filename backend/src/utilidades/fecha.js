
const obtenerFechaActual = () => {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeZone: 'America/Argentina/Buenos_Aires'
  }).format(new Date());
}

module.exports = {
    obtenerFechaActual
}