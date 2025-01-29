document.addEventListener('DOMContentLoaded', () => {
  const tablaRanking = document.getElementById('tabla-ranking').getElementsByTagName('tbody')[0];
  const fechaActualizacion = document.getElementById('fecha-actualizacion');

  // Cargar usuarios desde users.json
  fetch('users.json')
      .then(response => response.json())
      .then(usuarios => {
          // Obtener datos de Codeforces para cada usuario
          Promise.all(usuarios.map(obtenerDatosUsuario))
              .then(resultados => {
                  // Ordenar por rating (de mayor a menor)
                  resultados.sort((a, b) => b.rating - a.rating);

                  // Mostrar datos en la tabla
                  resultados.forEach((usuario, index) => {
                      const fila = tablaRanking.insertRow();
                      fila.insertCell().textContent = index + 1;
                      fila.insertCell().textContent = usuario.username;
                      fila.insertCell().textContent = usuario.nivel;
                      fila.insertCell().textContent = usuario.rating;

                      // Añadir clase para el color del nivel
                      fila.cells[2].classList.add(usuario.nivel.toLowerCase());
                  });

                  // Mostrar fecha de actualización
                  fechaActualizacion.textContent = new Date().toLocaleString();
              });
      });

  async function obtenerDatosUsuario(username) {
      const apiKey = 'e4292222676484bd941a2b9cbd765f019d4322e9';
      const apiSecret = 'b9d2fb1423c8640a1cf840e9d17d943f909e7f2e';
      const apiUrl = `https://codeforces.com/api/user.info?handles=${username}&apiKey=${apiKey}&apiSig=${generarApiSig(apiKey, apiSecret, `user.info?handles=${username}`)}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === 'OK') {
          const userInfo = data.result[0];
          return {
              username: userInfo.handle,
              rating: userInfo.rating,
              nivel: obtenerNivel(userInfo.rating)
          };
      } else {
          console.error(`Error al obtener datos para ${username}:`, data.comment);
          return { username, rating: 'N/A', nivel: 'N/A' };
      }
  }

  function generarApiSig(apiKey, apiSecret, method) {
      const time = Math.floor(Date.now() / 1000);
      const rand = Math.floor(Math.random() * 1000000);
      const hash = `${rand}/${apiKey}/${method}#${apiSecret}`;
      const apiSig = `${rand}${hash.sha512()}`;
      return apiSig;
  }

  function obtenerNivel(rating) {
      if (rating < 1200) return 'Newbie';
      if (rating < 1400) return 'Pupil';
      if (rating < 1600) return 'Specialist';
      if (rating < 1900) return 'Expert';
      if (rating < 2100) return 'Candidate Master';
      if (rating < 2300) return 'Master';
      if (rating < 2400) return 'International Master';
      if (rating < 3000) return 'Grandmaster';
      return 'International Grandmaster';
  }
});