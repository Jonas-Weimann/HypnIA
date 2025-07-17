const usuariosURL = "http://localhost:3000/api/usuarios";
const usuariosBusqueda = document.getElementById("usuarios-busqueda");
const contenedorUsuarios = document.getElementById("usuarios-contenedor");
const btnGestionarUsuarios = document.querySelector(".gestionar-usuarios");
const popupUsuarios = document.querySelector(".popup-usuarios");
const popupEdicionUsuarios = document.querySelector(".popup-edicion-usuarios");
btnGestionarUsuarios.addEventListener("click", () => {
  contenedorUsuarios.classList.toggle("activo");
  contenedorEmociones.classList.remove("activo");
  contenedor.classList.remove("activo");
});
let usuarios = [];

const obtenerUsuarios = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const respuesta = await fetch(usuariosURL, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await respuesta.json();
    usuarios = data;
    mostrarUsuarios(usuarios);
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
  }
};

const mostrarUsuarios = (usuariosAMostrar) => {
  contenedorUsuarios.innerHTML = "";
  const token = localStorage.getItem("token");
  if (!token) return;

  if (usuariosAMostrar.length === 0) {
    contenedorUsuarios.innerHTML = "<p>No se encontraron usuarios.</p>";
    return;
  }

  usuariosAMostrar.forEach((usuario) => {
    const usuarioDiv = document.createElement("div");
    usuarioDiv.classList.add("usuario-card");
    usuarioDiv.innerHTML = `
			<div class="usuario">
      <button class="eliminar-usuario" data-id="${
        usuario.id_usuario
      }">❌</button>
			  <button class="editar-usuario" data-id="${usuario.id_usuario}">🖊️</button>
        <img class="foto-perfil" src='./assets/images/profile-img/${
          usuario.foto_perfil
        }'/>
				<div class="nombre-usuario"><h2>${usuario.nombre.toUpperCase()}</h2></div></div>
				<div class="informacion-usuario">
					<p>ID: ${usuario.id_usuario}</p>
					<p>EMAIL: ${usuario.email}</p>
					<p>REGISTRO: ${new Date(usuario.fecha_registro).toLocaleDateString()}</p>
				</div>
		`;
    contenedorUsuarios.appendChild(usuarioDiv);
    const btnEliminar = usuarioDiv.querySelector(".eliminar-usuario");
    btnEliminar.addEventListener("click", () => {
      popupUsuarios.classList.add("activo");
      popupUsuarios.innerHTML = `
				<h2>¿Eliminar Usuario?</h2>
				<br/>
				<span>Esta acción no puede ser revertida ni desde el más allá.</span>
				<div class="confirmaciones">
					<button class="volver">Volver</button>
					<button class="confirmar-eliminar" data-id="${usuario.id_usuario}">Eliminar</button>
				</div>
			`;
    });
    const btnEditar = usuarioDiv.querySelector(".editar-usuario");
    btnEditar.addEventListener("click", () => {
      popupEdicionUsuarios.classList.add("activo");
      popupEdicionUsuarios.innerHTML = `
        <h2>Editar Usuario</h2>
          <form id="form-editar-usuario">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" value="${usuario.nombre}" required />
  
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value="${usuario.email}" required />
  
            <label for="foto_perfil">Foto de perfil:</label>
            <input type="text" id="foto_perfil" name="foto_perfil" value="${usuario.foto_perfil}" required />
  
            <div class="confirmaciones">
              <button type="button" class="volver">Volver</button>
              <button type="submit">Guardar Cambios</button>
            </div>
          </form>
        `;

      popupEdicionUsuarios
        .querySelector(".volver")
        .addEventListener("click", () => {
          popupEdicionUsuarios.classList.remove("activo");
          popupEdicionUsuarios.innerHTML = "";
        });

      popupEdicionUsuarios
        .querySelector("#form-editar-usuario")
        .addEventListener("submit", async (e) => {
          e.preventDefault();

          const nuevoNombre = e.target.nombre.value;
          const nuevoEmail = e.target.email.value;
          const nuevaFoto = e.target.foto_perfil.value;

          try {
            const respuesta = await fetch(`${usuariosURL}/editar-usuario`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                id_usuario: usuario.id_usuario,
                nombre: nuevoNombre,
                email: nuevoEmail,
                foto_perfil: nuevaFoto,
              }),
            });

            if (respuesta.ok) {
              popupEdicionUsuarios.innerHTML = `<p>Usuario actualizado con éxito</p>`;
              obtenerUsuarios();
            } else {
              popupEdicionUsuarios.innerHTML = `<p>Error actualizando usuario</p>`;
            }
          } catch (error) {
            popupEdicionUsuarios.innerHTML = `<p>Error actualizando usuario</p>`;
          } finally {
            setTimeout(() => {
              popupEdicionUsuarios.classList.remove("activo");
            }, 1500);
          }
        });
    });
  });
};

popupUsuarios.addEventListener("click", async (e) => {
  const token = localStorage.getItem("token");

  if (e.target.classList.contains("volver")) {
    popupUsuarios.classList.remove("activo");
    return;
  }

  if (e.target.classList.contains("confirmar-eliminar")) {
    const uid = e.target.dataset.id;
    try {
      const respuesta = await fetch(`${usuariosURL}/eliminar-usuario`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_usuario: uid }),
      });
      if (respuesta.ok) {
        popupUsuarios.innerHTML = `<h2>Usuario eliminado con éxito</h2>`;
        usuarios = usuarios.filter((e) => e.id_usuario !== parseInt(uid));
        mostrarUsuarios(usuarios);
        setTimeout(() => {
          popupUsuarios.classList.remove("activo");
        }, 1500);
      } else {
        console.error("Error al eliminar emoción");
      }
    } catch (error) {
      console.error("Error en la petición de eliminación:", error);
    }
  }
});

obtenerUsuarios();
