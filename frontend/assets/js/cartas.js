const container = document.getElementById('cartas-contenedor');
const cartasURL = "http://localhost:3000/api/cartas";

fetch(cartasURL)
  .then(response => response.json())
  .then(data => {
    data.forEach(carta => {
      const cartaDiv = document.createElement('div');
      cartaDiv.classList.add('carta');

      cartaDiv.innerHTML = `
        <img id="imagen-carta" src="./assets/images/cards/${carta.imagen}">
        <div class="nombre-carta"><h2>${carta.nombre}</h2></div>
        <div class="informacion-carta">
          <p><u>ELEMENTO</u>: ${carta.elemento}</p>
          <p><u>POLARIDAD</u>: ${carta.polaridad}</p>
          <p style="border-top: 1px solid white" >${carta.descripcion}</p>
        </div>
      `;

      container.appendChild(cartaDiv);
    });
  })
  .catch(error => {
    container.innerHTML = "<p>Error al cargar las cartas.</p>";
    console.error(error);
  });

