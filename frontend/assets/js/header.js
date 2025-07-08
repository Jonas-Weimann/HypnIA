const header = document.getElementById('header');
fetch('components/header.html')
    .then(res => res.text())
    .then(html => {
      header.innerHTML = html;
    })
    .catch(err => console.error('Error al cargar el header:', err));