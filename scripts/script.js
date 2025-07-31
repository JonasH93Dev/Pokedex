let offset = 0;
const limit = 20;

async function loadPokemon(limit, offset) {
  let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset);
  let data = await response.json();

  let container = document.getElementById("pokemonList");

  for (let p of data.results) {
    let detailResponse = await fetch(p.url);
    let pokemon = await detailResponse.json();
    container.innerHTML += getPokemonCardTemplate(pokemon);
  }

  makeCardsClickable();
}

async function loadMore() {
  offset += limit;
  await loadPokemon(limit, offset);
}

async function openOverlay(pokemonId) {
  let overlayResponse = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonId);
  let overlayPokemon = await overlayResponse.json();

  let moves = [];
  for (let i = 0; i < 2; i++) {
    let moveUrl = overlayPokemon.moves[i].move.url;
    let moveResponse = await fetch(moveUrl);
    let move = await moveResponse.json();
    moves.push(move);
  }

  document.getElementById("overlayContent").innerHTML = getOverlayCardTemplate(overlayPokemon, moves);
  document.getElementById("overlay").classList.remove("hidden");
}

function makeCardsClickable() {
  const cards = document.querySelectorAll(".pokemon-card");
  cards.forEach(card => {
    card.onclick = function () {
      let id = card.getAttribute("data-id");
      openOverlay(id);
    };
  });
}

function closeOverlay() {
  document.getElementById("overlay").classList.add("hidden");
}

window.onload = async function () {
  await loadPokemon(limit, offset);
};
