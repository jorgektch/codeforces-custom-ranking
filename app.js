document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    fetchUserInfo(username);
});

// Función para cargar el archivo JSON
async function loadRegisteredUsers() {
    try {
        const response = await fetch('users.json');
        if (!response.ok) {
            throw new Error('Error loading users.json');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Función para obtener la información del usuario de Codeforces
async function fetchUserInfo(username) {
    const url = `https://codeforces.com/api/user.info?handles=${username}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
            const user = data.result[0];
            const registeredUsers = await loadRegisteredUsers();
            const allUsers = [...registeredUsers, { username: user.handle, rating: user.rating }];
            displayRanking(allUsers);
        } else {
            displayError('User not found');
        }
    } catch (error) {
        console.error('Error:', error);
        displayError('An error occurred while fetching data');
    }
}

// Función para mostrar el ranking de usuarios
function displayRanking(users) {
    // Ordenar usuarios por rating (de mayor a menor)
    users.sort((a, b) => b.rating - a.rating);

    const userInfoDiv = document.getElementById('userInfo');
    let rankingHTML = '<h2>Ranking</h2><ol>';

    users.forEach(user => {
        const color = getColorByRating(user.rating);
        const profileLink = `https://codeforces.com/profile/${user.username}`;
        rankingHTML += `
            <li>
                <a href="${profileLink}" target="_blank" style="color: ${color};">
                    ${user.username} (${user.rating})
                </a>
            </li>`;
    });

    rankingHTML += '</ol>';
    userInfoDiv.innerHTML = rankingHTML;
}

// Función para obtener el color según el rating
function getColorByRating(rating) {
    if (!rating) return 'black'; // Si no hay rating, usar color negro
    if (rating >= 3000) return 'red'; // Legendary Grandmaster
    if (rating >= 2600) return 'red'; // International Grandmaster
    if (rating >= 2400) return '#FF8C00'; // Grandmaster
    if (rating >= 2300) return '#a0a'; // International Master
    if (rating >= 2100) return '#a0a'; // Master
    if (rating >= 1900) return 'blue'; // Candidate Master
    if (rating >= 1600) return '#03A89E'; // Expert
    if (rating >= 1400) return 'green'; // Specialist
    if (rating >= 1200) return 'gray'; // Pupil
    return 'black'; // Newbie
}

// Función para mostrar errores
function displayError(message) {
    const userInfoDiv = document.getElementById('userInfo');
    userInfoDiv.innerHTML = `<p class="error">${message}</p>`;
}