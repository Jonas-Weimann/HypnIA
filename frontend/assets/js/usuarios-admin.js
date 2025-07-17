const usuariosURL = "http://localhost:3000/api/usuarios";
const usuariosBusqueda = document.getElementById("usuarios-busqueda");
const contenedorUsuarios = document.getElementById("usuarios-contenedor");
const btnGestionarUsuarios = document.querySelector(".gestionar-usuarios");
const popupUsuarios = document.querySelector(".popup-usuarios");
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
        }'
				<div class="nombre-usuario"><h2>${usuario.nombre.toUpperCase()}</h2></div>
				<div class="informacion-usuario">
					<p>ID: ${usuario.id_usuario}</p>
					<p>EMAIL: ${usuario.email}</p>
					<p>REGISTRO: ${new Date(usuario.fecha_registro).toLocaleDateString()}</p>
				</div>
			</img>
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
