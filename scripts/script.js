let offset = 0;
let limit = 20;

window.onload = async function () {
  await loadPokemon();
  document.getElementById("loadMoreButton").onclick = loadMore;
};

async function loadPokemon() {
  let data = await fetchPokemonList();
  for (let p of data.results) {
    let pokemon = await fetchPokemonDetails(p.url);
    addPokemonCard(pokemon);
  }
  addCardClicks(); 
}

async function fetchPokemonList() {
  let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset);
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
  cards.forEach(card => {
    card.onclick = function () { openOverlay(card.getAttribute("data-id")); };
  });
}

async function openOverlay(id) {
  let pokemon = await fetchPokemonDetails("https://pokeapi.co/api/v2/pokemon/" + id);
  let moves = await fetchMoves(pokemon);
  showOverlay(pokemon, moves);
}

async function fetchMoves(pokemon) {
  let moves = [];
  for (let i = 0; i < 2; i++) {
    let moveResponse = await fetch(pokemon.moves[i].move.url);
    moves.push(await moveResponse.json());
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
