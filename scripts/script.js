let offset = 0;
const limit = 20;
let loadedPokemon = []; // speichert alle aktuell angezeigten Pokémon
let currentIndex = 0;   // Index des aktuell geöffneten Pokémon

window.onload = async function () {
  showLoading();
  await loadPokemon();
  hideLoading();
  document.getElementById("loadMoreButton").onclick = loadMore;
};

// Live-Suchfeld
async function handleSearchInput() {
  let value = document.getElementById("searchInput").value.trim().toLowerCase();
  if (value.length === 0) {
    resetToDefault();
    return;
  }
  if (value.length >= 3) {
    showLoading();
    let matches = await fetchAndFilterPokemon(value);
    await renderSearchResults(matches);
    hideLoading();
    document.getElementById("loadMoreButton").style.display = "none";
  }
}

// Standardliste wieder laden
async function resetToDefault() {
  offset = 0;
  loadedPokemon = [];
  let container = document.getElementById("pokemonList");
  container.innerHTML = "";
  showLoading();
  await loadPokemon();
  hideLoading();
  document.getElementById("loadMoreButton").style.display = "block";
}

// Holt und filtert Pokémon
async function fetchAndFilterPokemon(searchValue) {
  let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  let allData = await response.json();
  return allData.results.filter(p => p.name.includes(searchValue));
}

// Rendert Suchergebnisse
async function renderSearchResults(matches) {
  let container = document.getElementById("pokemonList");
  container.innerHTML = "";
  loadedPokemon = [];

  if (matches.length === 0) {
    container.innerHTML = "<p style='text-align:center; font-size:18px; padding:20px;'>No Pokémon found.</p>";
    return;
  }

  for (let p of matches) {
    let detail = await fetchPokemonDetails(p.url);
    addPokemonCard(detail);
  }
  addCardClicks();
}

// Pokémon-Liste laden
async function loadPokemon() {
  let data = await fetchPokemonList();
  for (let p of data.results) {
    let details = await fetchPokemonDetails(p.url);
    addPokemonCard(details);
  }
  addCardClicks();
}

async function fetchPokemonList() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset;
  let response = await fetch(url);
  return await response.json();
}

async function fetchPokemonDetails(url) {
  let response = await fetch(url);
  return await response.json();
}

function addPokemonCard(pokemon) {
  let container = document.getElementById("pokemonList");
  container.innerHTML += getPokemonCardTemplate(pokemon);
  loadedPokemon.push(pokemon); // speichern für Overlay-Navigation
}

function addCardClicks() {
  let cards = document.querySelectorAll(".pokemon-card");
  cards.forEach(card => card.onclick = () => openOverlay(card.getAttribute("data-id")));
}

async function openOverlay(id) {
  let index = loadedPokemon.findIndex(p => p.id == id);
  if (index !== -1) {
    currentIndex = index;
  }
  let pokemon = await fetchPokemonDetails("https://pokeapi.co/api/v2/pokemon/" + id);
  let moves = await fetchFirstMoves(pokemon);
  showOverlay(pokemon, moves);
}

async function fetchFirstMoves(pokemon) {
  let moves = [];
  for (let i = 0; i < 2 && i < pokemon.moves.length; i++) {
    let data = await fetch(pokemon.moves[i].move.url);
    moves.push(await data.json());
  }
  return moves;
}

function showOverlay(pokemon, moves) {
  document.getElementById("overlayContent").innerHTML = getOverlayCardTemplate(pokemon, moves);
  document.getElementById("overlay").classList.remove("hidden");
}

function closeOverlay() {
  document.getElementById("overlay").classList.add("hidden");
}

// Pfeilnavigation
async function prevPokemon() {
  if (currentIndex > 0) {
    currentIndex--;
    openOverlay(loadedPokemon[currentIndex].id);
  }
}

async function nextPokemon() {
  if (currentIndex < loadedPokemon.length - 1) {
    currentIndex++;
    openOverlay(loadedPokemon[currentIndex].id);
  }
}

async function loadMore() {
  offset += limit;
  showLoading();
  await loadPokemon();
  hideLoading();
}

function showLoading() {
  document.getElementById("loadingOverlay").classList.remove("hidden");
  let btn = document.getElementById("loadMoreButton");
  btn.disabled = true;
  btn.innerText = "Loading...";
}

function hideLoading() {
  document.getElementById("loadingOverlay").classList.add("hidden");
  let btn = document.getElementById("loadMoreButton");
  btn.disabled = false;
  btn.innerText = "Load More";
}
