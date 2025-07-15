const cartasURL = "http://localhost:3000/api/cartas";
const cartasBusqueda = document.getElementById("cartas-busqueda");
const contenedor = document.getElementById("cartas-contenedor");
let cartas = [];

const obtenerCartas = async () => {
	try {
		const respuesta = await fetch(cartasURL);
		const data = await respuesta.json();
		cartas = data;
		mostrarCartas(cartas);
	} catch (error) {
		console.error("Error obteniendo cartas:", error);
	}
};

const mostrarCartas = (cartasAMostrar) => {
	contenedor.innerHTML = "";

	if (cartasAMostrar.length === 0) {
    	contenedor.innerHTML = "<p>No se encontraron cartas.</p>";
    	return;
  	}

	cartasAMostrar.forEach(carta => {
		const cartaDiv = document.createElement("div");
		cartaDiv.classList.add('carta');
		cartaDiv.innerHTML = `
			<img id="imagen-carta" src="./assets/images/cartas/${carta.imagen}">
			<div class="nombre-carta"><h2>${carta.nombre}</h2></div>
			<div class="informacion-carta">
				<p><u>ELEMENTO</u>: ${carta.elemento}</p>
				<p><u>POLARIDAD</u>: ${carta.polaridad}</p>
				<p style="border-top: 1px solid white">${carta.descripcion}</p>
			</div>
		`;
		contenedor.appendChild(cartaDiv);
	});
};

const limpiarTexto = (texto) => { 
	return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
}

cartasBusqueda.addEventListener("input", () => {
	const consulta = limpiarTexto(cartasBusqueda.value).trim();
	if (!consulta) {
		mostrarCartas(cartas);
		return;
	}
	const filtradas = cartas.filter(carta =>
		limpiarTexto(carta.nombre).includes(consulta) ||
		limpiarTexto(carta.elemento).includes(consulta) ||
		limpiarTexto(carta.polaridad).includes(consulta)
	);

	mostrarCartas(filtradas);
});

const modificarLinks = () => {
	const token = localStorage.getItem("token");
	if (!token) return;

	const contenedor = document.querySelector(".cartas-emociones-links");
	if (!contenedor) return;

	contenedor.innerHTML = `
		<a href="cards.html">CARTAS</a>
        <a href="register-dream.html">REGISTRA TU SUEÑO</a>
        <a href="emotions.html">EMOCIONES</a>
	`;
}

obtenerCartas();
modificarLinks();