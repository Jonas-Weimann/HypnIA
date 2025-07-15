document.addEventListener("DOMContentLoaded", () => {
	const footer = document.getElementById("footer");
	if(!footer) return;

	fetch("components/footer.html")
	.then(res => res.text())
	.then(html => { 
		footer.innerHTML = html;
		copiarEmail();
		modificarFooter(footer);
	})
	.catch(err => console.error("Error al cargar el header:", err));
});


const copiarEmail = () => {
  const linksEmails = document.querySelectorAll(".copiar-email");

  linksEmails.forEach(linkEmail => {
		linkEmail.addEventListener("click", (e) => {
		e.preventDefault();
		const email = linkEmail.dataset.email;
		navigator.clipboard.writeText(email)
			.then(() => {
				mostrarMensajeCopiado();
			})
			.catch(error => {
				console.error("Error al copiar el correo:", error);
			});
		});
  });
};

const mostrarMensajeCopiado = () => {
  const mensajeCopiado = document.getElementById("mensaje-copiado");
  if (!mensajeCopiado) return;

  mensajeCopiado.classList.remove("oculto");
  mensajeCopiado.classList.add("visible");

  setTimeout(() => {
    mensajeCopiado.classList.remove("visible");
    mensajeCopiado.classList.add("oculto");
  }, 2000);
};

const modificarFooter = (footer) => {
	const token = localStorage.getItem("token");
	if (!token) return;

	const contenedor = footer.querySelector(".login-register-contenedor");
	if (!contenedor) return;

	contenedor.innerHTML = `
		<li><a href="index.html">Inicio</a></li>
		<li><a href="profile.html">Perfil</a></li>
		<li><a href="#" id="cerrar-sesion-footer">Cerrar sesión</a></li>
		
	`;

	const logout = footer.querySelector("#cerrar-sesion-footer");
	if (logout) {
		logout.addEventListener("click", e => {
		e.preventDefault();
		localStorage.clear();
		window.location.reload();
		});
	}
};