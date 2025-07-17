const emocionesURL = "http://localhost:3000/api/emociones";
const emocionesBusqueda = document.getElementById("emociones-busqueda");
const contenedorEmociones = document.getElementById("emociones-contenedor");
const btnGestionarEmociones = document.querySelector(".gestionar-emociones");
const popupEmociones = document.querySelector(".popup-emociones");
const popupEdicionEmociones = document.querySelector(
  ".popup-edicion-emociones"
);
btnGestionarEmociones.addEventListener("click", () => {
  contenedorEmociones.classList.toggle("activo");
  contenedorUsuarios.classList.remove("activo");
  contenedor.classList.remove("activo");
});

let emociones = [];

const obtenerEmociones = async () => {
  try {
    const respuesta = await fetch(emocionesURL);
    const data = await respuesta.json();
    emociones = data;
    mostrarEmociones(emociones);
  } catch (error) {
    console.error("Error obteniendo emociones:", error);
  }
};

const mostrarEmociones = (emocionesAMostrar) => {
  contenedorEmociones.innerHTML = "";
  const token = localStorage.getItem("token");
  if (!token) return;

  if (emocionesAMostrar.length === 0) {
    contenedorEmociones.innerHTML = "<p>No se encontraron emociones.</p>";
    return;
  }

  emocionesAMostrar.forEach((emocion) => {
    const emocionDiv = document.createElement("div");
    emocionDiv.classList.add("emocion");
    emocionDiv.style.backgroundImage = `url('./assets/images/emociones/${emocion.intensidad}.webp')`;
    emocionDiv.style.backdropFilter = "blur(10px)";
    emocionDiv.innerHTML = `
			<button class="eliminar-emocion" data-id="${emocion.id_emocion}">❌</button>
			<button class="editar-emocion" data-id="${emocion.id_emocion}">🖊️</button>
			<div class="nombre-emocion"><h2>${emocion.nombre.toUpperCase()}</h2></div>
			<div class="informacion-emocion">
				<p><u>INTENSIDAD</u>: ${emocion.intensidad}</p>
				<p><u>POLARIDAD</u>: ${emocion.polaridad}</p>
			</div>
		`;
    contenedorEmociones.appendChild(emocionDiv);
    const btnEliminar = emocionDiv.querySelector(".eliminar-emocion");
    btnEliminar.addEventListener("click", () => {
      popupEmociones.classList.add("activo");
      popupEmociones.innerHTML = `
				<h2>¿Eliminar Emoción?</h2>
				<br/>
				<span>Esta acción no puede ser revertida ni desde el más allá.</span>
				<div class="confirmaciones">
					<button class="volver">Volver</button>
					<button class="confirmar-eliminar" data-id="${emocion.id_emocion}">Eliminar</button>
				</div>
			`;
    });

    const btnEditar = emocionDiv.querySelector(".editar-emocion");
    btnEditar.addEventListener("click", () => {
      popupEdicionEmociones.classList.add("activo");
      popupEdicionEmociones.innerHTML = `
      <form id="form-editar-emocion" class="form-edicion">
        <h3>Editar emoción</h3>

        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required />

        <label for="polaridad">Polaridad:</label>
        <select id="polaridad" name="polaridad" required>
          <option value="">-- Seleccionar --</option>
          <option value="positiva">Positiva</option>
          <option value="negativa">Negativa</option>
          <option value="neutra">Neutra</option>
        </select>

        <label for="intensidad">Intensidad (1 a 10):</label>
        <input type="number" id="intensidad" name="intensidad" min="1" max="10" required />

        <div>
          <button type="button" class="volver">Volver</button>
          <button type="submit">Guardar cambios</button>
        </div>
      </form>
      `;
      document.getElementById("nombre").value = emocion.nombre;
      document.getElementById("polaridad").value = emocion.polaridad;
      document.getElementById("intensidad").value = emocion.intensidad;
      const btnVolver = popupEdicionEmociones.querySelector(".volver");
      btnVolver.addEventListener("click", () => {
        popupEdicionEmociones.classList.remove("activo");
        popupEdicionEmociones.innerHTML = "";
      });
      const form = document.getElementById("form-editar-emocion");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const datosActualizados = {
          nombre: form.nombre.value,
          polaridad: form.polaridad.value,
          intensidad: Number(form.intensidad.value),
        };

        try {
          const respuesta = await fetch(
            `http://localhost:3000/api/emociones/${emocion.id_emocion}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(datosActualizados),
            }
          );
          if (respuesta.ok) {
            popupEdicionEmociones.innerHTML = `<p>Emoción actualizada con éxito</p>`;
            obtenerEmociones();
          }
        } catch (error) {
          popupEdicionEmociones.innerHTML = `<p>Error actualizando emoción</p>`;
        } finally {
          setTimeout(() => {
            popupEdicionEmociones.classList.remove("activo");
          }, 1500);
        }
      });
    });
  });
};

popupEmociones.addEventListener("click", async (e) => {
  const token = localStorage.getItem("token");

  if (e.target.classList.contains("volver")) {
    popupEmociones.classList.remove("activo");
    return;
  }

  if (e.target.classList.contains("confirmar-eliminar")) {
    const eid = e.target.dataset.id;
    try {
      const respuesta = await fetch(`${emocionesURL}/${eid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (respuesta.ok) {
        popupEmociones.innerHTML = `<h2>Emoción eliminada con éxito</h2>`;
        emociones = emociones.filter((e) => e.id_emocion !== parseInt(eid));
        mostrarEmociones(emociones);
        setTimeout(() => {
          popupEmociones.classList.remove("activo");
        }, 1500);
      } else {
        console.error("Error al eliminar emoción");
      }
    } catch (error) {
      console.error("Error en la petición de eliminación:", error);
    }
  }
});

const btnNuevaEmocion = document.getElementById("btn-nueva-emocion");

btnNuevaEmocion.addEventListener("click", async () => {
  popupEdicionEmociones.classList.add("activo");
  popupEdicionEmociones.innerHTML = `
       <form id="form-crear-emocion" class="form-creacion">
        <h3>Crear emoción</h3>

        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required />

        <label for="polaridad">Polaridad:</label>
        <select id="polaridad" name="polaridad" required>
          <option value="">Seleccionar</option>
          <option value="positiva">Positiva</option>
          <option value="negativa">Negativa</option>
          <option value="neutra">Neutra</option>
        </select>

        <label for="intensidad">Intensidad (1 a 10):</label>
        <input type="number" id="intensidad" name="intensidad" min="1" max="10" required />

        <div>
          <button type="button" class="volver">Volver</button>
          <button type="submit">Guardar cambios</button>
        </div>
      </form>`;

  const btnVolver = popupEdicionEmociones.querySelector(".volver");
  btnVolver.addEventListener("click", () => {
    popupEdicionEmociones.classList.remove("activo");
    popupEdicionEmociones.innerHTML = "";
  });
  const form = document.getElementById("form-crear-emocion");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
      nombre: form.nombre.value,
      polaridad: form.polaridad.value,
      intensidad: Number(form.intensidad.value),
    };

    const token = localStorage.getItem("token");

    try {
      const respuesta = await fetch(emocionesURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });
      if (respuesta.ok) {
        popupEdicionEmociones.innerHTML = `<p>Emoción creada con éxito</p>`;
        obtenerEmociones();
      } else {
        popupEdicionEmociones.innerHTML = `<p>Error creando emoción</p>`;
      }
    } catch (error) {
      popupEdicionEmociones.innerHTML = `<p>Error creando emoción</p>`;
    } finally {
      setTimeout(() => {
        popupEdicionEmociones.classList.remove("activo");
      }, 1500);
    }
  });
});

obtenerEmociones();
