const cartasURL = "http://localhost:3000/api/cartas";
const contenedor = document.getElementById("cartas-contenedor");
let cartas = [];

const crearSelect = (name, emociones = []) => {
  let select = `<select name="${name}" required>`;
  select += `<option value="">Seleccionar</option>`;
  emociones.forEach((e) => {
    select += `<option value="${e.id_emocion}">${e.nombre}</option>`;
  });
  select += `</select>`;
  return select;
};

const btnGestionarCartas = document.querySelector(".gestionar-cartas");
const popupCarta = document.querySelector(".popup-carta");
const popupEdicionCarta = document.querySelector(".popup-edicion-carta");

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

    const btnEditar = cartaDiv.querySelector(".editar-carta");
    btnEditar.addEventListener("click", async () => {
      popupEdicionCarta.classList.add("activo");

      const res = await fetch("http://localhost:3000/api/emociones");
      const emociones = await res.json();

      popupEdicionCarta.innerHTML = `
    <form id="form-editar-carta">
      <h2>Editar Carta</h2>
      <label>Nombre:</label>
      <input type="text" name="nombre" value="${carta.nombre}" required />
      <label>Descripción:</label>
      <input type="text" name="descripcion" value="${
        carta.descripcion
      }" required />
      <label>Imagen:</label>
      <input type="text" name="imagen" value="${carta.imagen}" required />
      <label>Elemento:</label>
      <input type="text" name="elemento" value="${carta.elemento}" required />
      <label>Polaridad:</label>
      <input type="text" name="polaridad" value="${carta.polaridad}" required />
      <label>Emoción 1:</label>${crearSelect("emocion1", emociones)}
      <label>Emoción 2:</label>${crearSelect("emocion2", emociones)}
      <label>Emoción 3:</label>${crearSelect("emocion3", emociones)}
      <div>
      <button type="button" class="volver">Volver</button>
      <button type="submit">Guardar cambios</button>
      </div>
    </form>
  `;

      const formEditar = document.getElementById("form-editar-carta");
      formEditar.querySelector(".volver").addEventListener("click", (e) => {
        e.preventDefault();
        popupEdicionCarta.classList.remove("activo");
      });
      formEditar.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(formEditar);
        const emociones = [
          parseInt(fd.get("emocion1")),
          parseInt(fd.get("emocion2")),
          parseInt(fd.get("emocion3")),
        ];

        const datosActualizados = {
          nombre: fd.get("nombre"),
          descripcion: fd.get("descripcion"),
          imagen: fd.get("imagen"),
          elemento: fd.get("elemento"),
          polaridad: fd.get("polaridad"),
          emociones,
        };

        const cid = btnEditar.dataset.id;
        try {
          const respuesta = await fetch(`${cartasURL}/${cid}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(datosActualizados),
          });
          if (respuesta.ok) {
            popupEdicionCarta.innerHTML = `<p>Carta actualizada con éxito</p>`;
            obtenerCartas();
          } else {
            popupEdicionCarta.innerHTML = `<p>Error actualizando carta</p>`;
          }
        } catch {
          popupEdicionCarta.innerHTML = `<p>Error actualizando carta</p>`;
        } finally {
          setTimeout(() => {
            popupEdicionCarta.classList.remove("activo");
          }, 1500);
        }
      });
    });
  });

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
};

const btnNuevaCarta = document.getElementById("btn-nueva-carta");

btnNuevaCarta.addEventListener("click", async () => {
  const res = await fetch("http://localhost:3000/api/emociones");
  const emociones = await res.json();
  popupEdicionCarta.classList.add("activo");
  popupEdicionCarta.innerHTML = `
  <form id="form-crear-carta">
    <h2>Crear Carta</h2>

    <label>Nombre:</label>
    <input type="text" name="nombre" required />

    <label>Descripción:</label>
    <input type="text" name="descripcion" required />

    <label>Imagen:</label>
    <input type="text" name="imagen" required />

    <label>Elemento:</label>
    <input type="text" name="elemento" required />

    <label>Polaridad:</label>
    <input type="text" name="polaridad" required />

    <label>Emoción 1:</label>
    ${crearSelect("emocion1", emociones)}

    <label>Emoción 2:</label>
    ${crearSelect("emocion2", emociones)}

    <label>Emoción 3:</label>
    ${crearSelect("emocion3", emociones)}

    <div>
      <button type="button" class="volver">Volver</button>
      <button type="submit">Crear carta</button>
    </div>
  </form>
  `;

  popupEdicionCarta.querySelector(".volver").addEventListener("click", () => {
    popupEdicionCarta.classList.remove("activo");
    popupEdicionCarta.innerHTML = "";
  });

  popupEdicionCarta
    .querySelector("#form-crear-carta")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const fd = new FormData(e.target);
      const emociones = [
        parseInt(fd.get("emocion1")),
        parseInt(fd.get("emocion2")),
        parseInt(fd.get("emocion3")),
      ];

      const datos = {
        nombre: fd.get("nombre"),
        descripcion: fd.get("descripcion"),
        imagen: fd.get("imagen"),
        elemento: fd.get("elemento"),
        polaridad: fd.get("polaridad"),
        emociones,
      };

      const token = localStorage.getItem("token");

      try {
        const respuesta = await fetch(cartasURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(datos),
        });

        if (respuesta.ok) {
          popupEdicionCarta.innerHTML = `<p>Carta creada con éxito</p>`;
          obtenerCartas();
        } else {
          popupEdicionCarta.innerHTML = `<p>Error al crear la carta</p>`;
        }
      } catch (error) {
        console.error("Error:", error);
        popupEdicionCarta.innerHTML = `<p>Error interno al crear la carta</p>`;
      } finally {
        setTimeout(() => {
          popupEdicionCarta.classList.remove("activo");
        }, 1500);
      }
    });
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
