document.addEventListener("DOMContentLoaded", async () => {
	const header = document.getElementById("header");
	const sesionActiva = await verificarSesion();
	if (!header) return;

	try {
		const res = await fetch("components/header.html");
		const html = await res.text();
		header.innerHTML = html;

		const token = localStorage.getItem("token");

		if (!token || !sesionActiva) return;
		
		const headerLinks = header.querySelector(".header-links");

		if (!headerLinks) return;

		const fotoPerfil = await obtenerPerfil(token);

		headerLinks.innerHTML = `
				<ul>
					<li><a href="cards.html">Cartas</a></li>
					<li><a href="emotions.html">Emociones</a></li>
					<li><a href="register-dream.html">Registra tu sueño</a></li>
					<li><a href="social.html">Explora el mundo</a></li>
					<li><a href="#" id="cerrar-sesion-header">Cerrar sesión</a></li>
					<li style="padding: 0;" class="header-perfil"><a href="profile.html">
					<img id="foto-perfil" src="${fotoPerfil}" alt="Perfil" >

					</a></li>
				</ul>
			`;

		const logout = header.querySelector("#cerrar-sesion-header");
		if (logout) {
			logout.addEventListener("click", (e) => {
			e.preventDefault();
			localStorage.clear();
			window.location = "inicio.html";
			});
		}
	} catch (error) {
		console.error("Error al agregar el evento de cierre de sesión:", error);
	}
});


const verificarSesion = async () => {
	const token = localStorage.getItem("token");
	if (!token) {
		return false;
	}

	try {
		const respuesta = await fetch("http://localhost:3000/api/usuarios/estado/activo", {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${token}`,
		},
		});

		if (!respuesta.ok) {
			return false;
		}

		const resultado = await respuesta.json();
		return (resultado.activo === true);

	} catch (error) {
		console.error("No se logró verificar la sesión.", error);
		return false;
	}
};

const mostrarMensajeExpirado = async () => {
	const mensajeExpirado = document.querySelector(".mensaje-expirado");
	const token = localStorage.getItem("token");
	const sesionActiva = await verificarSesion();
	if (!mensajeExpirado) return;

	if(sesionActiva) {
		mensajeExpirado.classList.remove("visible");
		mensajeExpirado.classList.add("oculto");
	}

	if(token && !sesionActiva) {
		mensajeExpirado.classList.remove("oculto");
		mensajeExpirado.classList.add("visible");
	}
};

async function obtenerPerfil(token) {
	const rutaImagen = "assets/images/profile-img/";

	try {
		const urlPerfil = `http://localhost:3000/api/usuarios/perfil`;

		const response = await fetch(urlPerfil, {
			method: 'GET',
			headers: {
				"Authorization": `Bearer ${token}`
			}
		})
								
		const data = await response.json()
		const fotoPerfil = rutaImagen + data.foto_perfil;
		return fotoPerfil;
	} catch (error) {
		console.error("Error al obtener el perfil del usuario:", error);
		return null;
	}
};