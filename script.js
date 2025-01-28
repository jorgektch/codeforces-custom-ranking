// Claves para la API
const API_KEY = "e4292222676484bd941a2b9cbd765f019d4322e9";
const API_SECRET = "b9d2fb1423c8640a1cf840e9d17d943f909e7f2e";

// Niveles y colores según el rating
const LEVELS = [
  { name: "Novice", min: 0, max: 1199, class: "level-novice" },
  { name: "Pupil", min: 1200, max: 1399, class: "level-pupil" },
  { name: "Specialist", min: 1400, max: 1599, class: "level-specialist" },
  { name: "Expert", min: 1600, max: 1899, class: "level-expert" },
  { name: "Master", min: 1900, max: 2099, class: "level-master" },
  { name: "Grandmaster", min: 2100, max: Infinity, class: "level-grandmaster" },
];

// Leer nombres de usuario desde el archivo JSON
async function fetchUsernames() {
  try {
    const response = await fetch("users.json");
    return await response.json();
  } catch (error) {
    console.error("Error al cargar los nombres de usuario:", error);
  }
}

// Generar hash para la solicitud
function generateAPISignature(method, params) {
  const time = Math.floor(Date.now() / 1000);
  const rand = Math.random().toString(36).substring(2, 8);
  const query = `?apiKey=${API_KEY}&time=${time}&${params}`;
  const hashBase = `${rand}/${method}${query}#${API_SECRET}`;
  const hash = CryptoJS.SHA512(hashBase).toString();
  return { rand, query, hash };
}

// Consultar API para obtener datos de usuarios
async function fetchUserRatings(usernames) {
  const method = "user.info";
  const params = `handles=${usernames.join(";")}`;
  const { rand, query, hash } = generateAPISignature(method, params);

  try {
    const response = await fetch(
      `https://codeforces.com/api/${method}${query}&apiSig=${rand}${hash}`
    );
    const data = await response.json();
    if (data.status === "OK") {
      return data.result;
    } else {
      console.error("Error en la API:", data.comment);
    }
  } catch (error) {
    console.error("Error al consultar la API:", error);
  }
}

// Determinar nivel según rating
function getLevel(rating) {
  for (const level of LEVELS) {
    if (rating >= level.min && rating <= level.max) {
      return level;
    }
  }
  return LEVELS[0]; // Default: Novice
}

// Renderizar la tabla de ranking
function renderRankingTable(users) {
  const tbody = document.querySelector("#ranking-table tbody");
  tbody.innerHTML = "";

  users
    .sort((a, b) => b.rating - a.rating) // Ordenar por rating
    .forEach((user, index) => {
      const level = getLevel(user.rating);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.handle}</td>
        <td>${user.rating}</td>
        <td class="${level.class}">${level.name}</td>
      `;
      tbody.appendChild(row);
    });
}

// Inicializar la aplicación
async function init() {
  const usernames = await fetchUsernames();
  if (usernames && usernames.length > 0) {
    const users = await fetchUserRatings(usernames);
    renderRankingTable(users);
  } else {
    console.error("No se encontraron usuarios.");
  }
}

// Cargar CryptoJS para hashing
const script = document.createElement("script");
script.src =
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
script.onload = init;
document.head.appendChild(script);
