let offset = 0;
const limit = 20;

window.onload = async function () {
  await loadPokemon();
  document.getElementById("loadMoreButton").onclick = loadMore;
};

async function handleSearchInput() {
  let value = document.getElementById("searchInput").value.trim().toLowerCase();
  if (value.length === 0) { 
    resetToDefault();
    return;
  }
  if (value.length >= 3) {
    let matches = await fetchAndFilterPokemon(value);
    renderSearchResults(matches);
  }
}

async function resetToDefault() {
  offset = 0;
  let container = document.getElementById("pokemonList");
  container.innerHTML = "";
  await loadPokemon();
}

async function fetchAndFilterPokemon(searchValue) {
  let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  let allData = await response.json();
  return allData.results.filter(p => p.name.includes(searchValue));
}


async function renderSearchResults(matches) {
  let container = document.getElementById("pokemonList");
  container.innerHTML = "";
  for (let p of matches) {
    let detail = await fetchPokemonDetails(p.url);
    addPokemonCard(detail);
  }
  addCardClicks();
}


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
}

function addCardClicks() {
  let cards = document.querySelectorAll(".pokemon-card");
  cards.forEach(card => card.onclick = () => openOverlay(card.getAttribute("data-id")));
}

async function openOverlay(id) {
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

async function loadMore() {
  offset += limit;
  await loadPokemon();
}
