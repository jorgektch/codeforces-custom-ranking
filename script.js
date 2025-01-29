const apiKey = 'e4292222676484bd941a2b9cbd765f019d4322e9';
const secret = 'b9d2fb1423c8640a1cf840e9d17d943f909e7f2e';

async function fetchRating(handle) {
    const methodName = 'user.info';
    const time = Math.floor(Date.now() / 1000);
    const rand = generateRandomString(6);
    const params = `apiKey=${apiKey}&handles=${handle}&time=${time}`;
    const hashInput = `${rand}/${methodName}?${params}#${secret}`;
    const apiSig = rand + CryptoJS.SHA512(hashInput).toString();

    const url = `https://codeforces.com/api/${methodName}?${params}&apiSig=${apiSig}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'OK') {
            const user = data.result[0];
            return {
                handle: user.handle,
                rating: user.rating || 'Sin rating',
                rank: user.rank || 'Sin rango'
            };
        } else {
            console.error(`Error fetching data for ${handle}: ${data.comment}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching data for ${handle}: ${error}`);
        return null;
    }
}

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function getColorForRating(rating) {
    if (rating >= 4000) return '#ff0000'; // eponym
    if (rating >= 3000) return '#ff0000'; // Legendary Grandmaster
    if (rating >= 2600) return '#ff0000'; // International Grandmaster
    if (rating >= 2400) return '#ff0000'; // Grandmaster
    if (rating >= 2300) return '#FF8C00'; // International Master
    if (rating >= 2100) return '#FF8C00'; // Master
    if (rating >= 1900) return '#a0a';    // Candidate Master
    if (rating >= 1600) return '#0000ff'; // Expert
    if (rating >= 1400) return '#03a89e'; // Specialist
    if (rating >= 1200) return '#008000'; // Pupil
    return '#808080';                     // Newbie
}

function formatDate() {
    const date = new Date();
    const options = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
    };
    return date.toLocaleDateString('en-US', options);
}

async function updateRanking() {
    // Mostrar el loader mientras se cargan los datos
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
    loader.textContent = 'Cargando datos... 0%'; // Inicializar el porcentaje

    const usersResponse = await fetch('users.json');
    const users = await usersResponse.json();

    // Paso 1: Obtener la información de los usuarios
    const ratings = [];
    let usersProcessed = 0; // Contador de usuarios procesados

    for (const handle of users) {
        const userInfo = await fetchRating(handle);
        usersProcessed++;

        // Actualizar el porcentaje en el loader
        const percentage = Math.round((usersProcessed / users.length) * 100);
        loader.textContent = `Cargando datos... ${percentage}%`; // Actualizar el mensaje

        if (userInfo) {
            ratings.push({
                handle: userInfo.handle,
                rating: userInfo.rating !== 'Sin rating' ? parseInt(userInfo.rating) : null,
                rank: userInfo.rank,
                color: userInfo.rating !== 'Sin rating' ? getColorForRating(userInfo.rating) : '#000000'
            });
        }
    }

    // Paso 2: Ordenar a los usuarios por su rating (de mayor a menor)
    ratings.sort((a, b) => b.rating - a.rating);

    // Paso 3: Pintar la tabla con los datos ordenados
    const tableBody = document.querySelector('#rankingTable tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar las nuevas filas

    ratings.forEach((user, index) => {
        const row = document.createElement('tr');
        const positionCell = document.createElement('td');
        const handleCell = document.createElement('td');
        const ratingCell = document.createElement('td');
        const rankCell = document.createElement('td');

        positionCell.textContent = index + 1; // La posición es el índice del arreglo + 1

        // Crear el hipervínculo para el nombre de usuario
        const handleLink = document.createElement('a');
        handleLink.textContent = user.handle;
        handleLink.style.fontWeight = 'bold'; // Aplicar negrita

        handleLink.href = `https://codeforces.com/profile/${user.handle}`;
        handleLink.target = '_blank';
        handleLink.style.color = user.color;
        handleLink.addEventListener('mouseover', () => {
            handleLink.style.textDecoration = 'underline'; // Aplica subrayado al pasar el cursor
        });

        handleLink.addEventListener('mouseout', () => {
            handleLink.style.textDecoration = 'none'; // Elimina el subrayado al quitar el cursor
        });

        // Aplicar el color correspondiente al rating en la celda de username
        handleCell.appendChild(handleLink);


        ratingCell.textContent = user.rating !== null ? user.rating : 'Sin rating';
        rankCell.textContent = user.rank;

        // Establecer el color del texto según el rating
        ratingCell.style.color = user.color;
        rankCell.style.color = user.color;

        row.appendChild(positionCell);
        row.appendChild(handleCell);
        row.appendChild(ratingCell);
        row.appendChild(rankCell);
        tableBody.appendChild(row);
    });

    // Paso 4: Mostrar la fecha, hora y zona horaria
    const footer = document.querySelector('#footer-info');
    footer.textContent = `Información obtenida el ${formatDate()}`;

    // Paso 5: Preparar los datos para el gráfico
    // Definir los límites de rating según los ranks de Codeforces
    const ratingLimits = [
        { rating: 4000, label: 'Eponym', color: '#ff0000' },
        { rating: 3000, label: 'Legendary Grandmaster', color: '#ff0000' },
        { rating: 2600, label: 'International Grandmaster', color: '#ff0000' },
        { rating: 2400, label: 'Grandmaster', color: '#ff0000' },
        { rating: 2300, label: 'International Master', color: '#FF8C00' },
        { rating: 2100, label: 'Master', color: '#FF8C00' },
        { rating: 1900, label: 'Candidate Master', color: '#a0a' },
        { rating: 1600, label: 'Expert', color: '#0000ff' },
        { rating: 1400, label: 'Specialist', color: '#03a89e' },
        { rating: 1200, label: 'Pupil', color: '#008000' },
        { rating: 0, label: 'Newbie', color: '#808080' }
    ];

    // Obtener el usuario con el mayor rating
    const maxRatingUser = ratings.reduce((max, user) => (user.rating > max.rating ? user : max), ratings[0]);

    // Determinar el label correspondiente para el usuario con el mayor rating
    let userRank = ratingLimits.find(rank => maxRatingUser.rating >= rank.rating).label;

    // Determinar los rangos a mostrar (el rango actual y los dos superiores)
    let rankIndex = ratingLimits.findIndex(rank => rank.label === userRank);
    let ranksToShow = ratingLimits.slice(Math.max(0, rankIndex - 2), rankIndex + 1);

    // Preparar los datos del gráfico
    const chartLabels = ratings.map(user => user.handle);
    const chartData = ratings.map(user => user.rating);
    const chartColors = ratings.map(user => user.color);

    // Crear el gráfico de barras con Chart.js
    const ctx = document.getElementById('ratingChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', // Cambiar a gráfico de barras verticales
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Rating',
                data: chartData,
                backgroundColor: chartColors,
                borderColor: chartColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y', // Establecer la orientación de las barras en horizontal
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Rating'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'User Handle'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Oculta la leyenda
                },
                annotation: {
                    annotations: ranksToShow.map((range) => ({
                        type: 'line',
                        mode: 'vertical', // Líneas verticales
                        scaleID: 'x', // Usar el eje X para las líneas
                        value: range.rating, // El valor de rating donde la línea se debe colocar
                        borderColor: range.color, // El color de la línea basado en el rango
                        borderWidth: 2,
                        label: {
                            content: range.label, // Mostrar el nombre del rango
                            enabled: true,
                            position: 'top',
                            font: {
                                size: 12,
                                weight: 'bold'
                            },
                            color: range.color
                        }
                    }))
                }
            }
        }
    });







    // Ocultar el loader una vez que los datos se hayan cargado
    loader.style.display = 'none';
}
updateRanking();
