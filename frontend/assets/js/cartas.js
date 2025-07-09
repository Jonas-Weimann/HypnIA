const container = document.getElementById('cartas_container');
const cartasURL = "http://localhost:3000/api/cartas";

fetch(cartasURL)
  .then(response => response.json())
  .then(data => {
    data.forEach(carta => {
      const cartaDiv = document.createElement('div');
      cartaDiv.classList.add('carta');

      cartaDiv.innerHTML = `
        <div class="nombre_carta"><h2>${carta.nombre}</h2></div>
        <p><strong>ELEMENTO:</strong> ${carta.elemento}</p>
        <p><strong>POLARIDAD:</strong> ${carta.polaridad}</p>
        <p>${carta.descripcion}</p>
      `;

      container.appendChild(cartaDiv);
    });
  })
  .catch(error => {
    container.innerHTML = "<p>Error al cargar las cartas.</p>";
    console.error(error);
  });

