document.addEventListener("DOMContentLoaded", () => {
	const header = document.getElementById("header");
	if (!header) return;

	fetch("components/header.html")
		.then(res => res.text())
		.then(html => {
		header.innerHTML = html;

		const token = localStorage.getItem("token");
		if (!token) return;


		const headerLinks = header.querySelector(".header-links");
		const datosUsuario = localStorage.getItem("usuario");
		const usuario = JSON.parse(datosUsuario);

		if (!headerLinks) return;

		headerLinks.innerHTML = `
			<ul>
				<li><a href="cards.html">Cartas</a></li>
				<li><a href="emotions.html">Emociones</a></li>
				<li><a href="register-dream.html">Registra tu sueño</a></li>
				<li><a href="social.html">Explora el mundo</a></li>
				<li><a href="#" id="cerrar-sesion-header">Cerrar sesión</a></li>
				<li style="padding: 0;" class="header-perfil"><a href="profile.html">
					<img id="foto-perfil" src="./assets/images/${usuario.pfp}" alt="Perfil" >
				</a></li>
			</ul>
		`;
	
		const logout = header.querySelector("#cerrar-sesion-header");
		if (logout) {
			logout.addEventListener("click", e => {
			e.preventDefault();
        localStorage.clear()
        window.location.reload();
			});
		}
		})
		.catch(err => console.error("Error al cargar el header:", err));
});