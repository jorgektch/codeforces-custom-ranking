document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    fetchUserInfo(username);
});

function fetchUserInfo(username) {
    const url = `https://codeforces.com/api/user.info?handles=${username}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                const user = data.result[0];
                displayUserInfo(user);
            } else {
                displayError('User not found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayError('An error occurred while fetching data');
        });
}

function displayUserInfo(user) {
    const userInfoDiv = document.getElementById('userInfo');
    userInfoDiv.innerHTML = `
        <h2>${user.handle}</h2>
        <p><strong>Rating:</strong> ${user.rating || 'N/A'}</p>
        <p><strong>Max Rating:</strong> ${user.maxRating || 'N/A'}</p>
        <p><strong>Rank:</strong> ${user.rank || 'N/A'}</p>
        <p><strong>Max Rank:</strong> ${user.maxRank || 'N/A'}</p>
    `;
}

function displayError(message) {
    const userInfoDiv = document.getElementById('userInfo');
    userInfoDiv.innerHTML = `<p class="error">${message}</p>`;
}