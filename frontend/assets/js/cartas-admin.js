const cartasURL = "http://localhost:3000/api/cartas";
const contenedor = document.getElementById("cartas-contenedor");
let cartas = [];

const btnGestionarCartas = document.querySelector(".gestionar-cartas");
const popupCarta = document.querySelector(".popup-carta");

btnGestionarCartas.addEventListener("click", () => {
  contenedor.classList.toggle("activo");
  contenedorEmociones.classList.remove("activo");
  contenedorUsuarios.classList.remove("activo");
});

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
  const token = localStorage.getItem("token");
  if (!token) return;

  if (cartasAMostrar.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron cartas.</p>";
    return;
  }

  cartasAMostrar.forEach((carta) => {
    const cartaDiv = document.createElement("div");
    cartaDiv.classList.add("carta");
    cartaDiv.innerHTML = `
            <button class="eliminar-carta" data-id="${carta.id_carta}">❌</button>
            <button class="editar-carta" data-id="${carta.id_carta}">🖊️</button>
			<img id="imagen-carta" src="./assets/images/cartas/${carta.imagen}">
			<div class="nombre-carta"><h2>${carta.nombre}</h2></div>
			<div class="informacion-carta">
				<p><u>ELEMENTO</u>: ${carta.elemento}</p>
				<p><u>POLARIDAD</u>: ${carta.polaridad}</p>
				<p style="border-top: 1px solid white">${carta.descripcion}</p>
			</div>
		`;
    contenedor.appendChild(cartaDiv);

    const btnEliminar = cartaDiv.querySelector(".eliminar-carta");
    btnEliminar.addEventListener("click", async () => {
      popupCarta.classList.add("activo");
      popupCarta.innerHTML = `<h2>¿Eliminar Carta?</h2> <br/> <span>Esta acción no puede ser revertida ni desde el más allá.</span> <div class="confirmaciones"> <button class="volver">Volver</button> <button class="confirmar-eliminar" data-id="${carta.id_carta}">Eliminar</button></div>`;
    });

    // const btnEditar = cartaDiv.querySelector(".eliminar-carta");
    // btnEditar.addEventListener("click", async () => {
    //   const cid = btnEditar.dataset.id;
    //   try {
    //     const respuesta = await fetch(`${cartasURL}/${cid}`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     if (respuesta.ok) {
    //       cartas = cartas.filter((c) => c.id_carta !== parseInt(cid));
    //       mostrarCartas(cartas);
    //     } else {
    //       console.log("Error eliminando carta");
    //     }
    //   } catch (error) {
    //     console.log("Error en la petición para eliminar carta");
    //   }
    // });
  });
};

popupCarta.addEventListener("click", async (e) => {
  const token = localStorage.getItem("token");
  if (e.target.classList.contains("volver")) {
    popupCarta.classList.remove("activo");
    return;
  }

  if (e.target.classList.contains("confirmar-eliminar")) {
    const cid = e.target.dataset.id;
    try {
      const respuesta = await fetch(`${cartasURL}/${cid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (respuesta.ok) {
        popupCarta.innerHTML = `<h2>Carta eliminada con éxito</h2>`;
        cartas = cartas.filter((c) => c.id_carta !== parseInt(cid));
        mostrarCartas(cartas);
        setTimeout(() => {
          popupCarta.classList.remove("activo");
        }, 1500);
      } else {
        console.error("Error al eliminar carta");
      }
    } catch (error) {
      console.error("Error en la petición de eliminación:", error);
    }
  }
});

const limpiarTexto = (texto) => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

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
};

obtenerCartas();
modificarLinks();
