async function fetchPokemonList(limit = 20, offset = 0) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  return await response.json();
}

async function fetchPokemonDetails(url) {
  let response = await fetch(url);
  return await response.json();
}

function renderPokemon(pokemonData, container) {
  container.innerHTML += getPokemonCardTemplate(pokemonData);
}

async function init() {
  try {
    let data = await fetchPokemonList();
    let container = document.getElementById("pokemonList");

    for (let pokemon of data.results) {
      let detailData = await fetchPokemonDetails(pokemon.url);
      renderPokemon(detailData, container);
    }
  } catch (error) {
    console.error("Fehler beim Laden der Pokémon:", error);
  }
}

window.onload = init;
