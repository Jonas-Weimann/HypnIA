document.addEventListener("DOMContentLoaded", () => {
	const header = document.getElementById("header");
	if (!header) return;
	fetch("components/header.html")
		.then(res => res.text())
		.then(html => {
		header.innerHTML = html;

		const token = localStorage.getItem("token");
		if (!token) return;

		const nav = header.querySelector("nav ul");
		if (!nav) return;

		nav.innerHTML = `
			<li><a href="#" id="logout">Cerrar sesión</a></li>
			<li><a href="#Perfil">
			<img src="assets/images/perfil-default.webp" alt="Perfil" class="avatar">
			</a></li>
			
		`;

		const logout = header.querySelector("#logout");
		if (logout) {
			logout.addEventListener("click", e => {
			e.preventDefault();
			localStorage.removeItem("token");
			window.location.reload();
			});
		}
		})
		.catch(err => console.error("Error al cargar el header:", err));
});