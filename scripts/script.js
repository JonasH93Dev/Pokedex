async function fetchPokemonList(limit = 20, offset = 0) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  return await response.json();
}

async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  return await response.json();
}

function renderPokemon(pokemonData, container) {
  container.innerHTML += getPokemonCardTemplate(pokemonData);
  addCardClickEvents();
}

async function init() {
  try {
    const data = await fetchPokemonList();
    const container = document.getElementById("pokemonList");

    for (let pokemon of data.results) {
      const detailData = await fetchPokemonDetails(pokemon.url);
      renderPokemon(detailData, container);
    }
  } catch (error) {
    console.error("Fehler beim Laden der Pokémon:", error);
  }
}

function addCardClickEvents() {
  const cards = document.querySelectorAll(".pokemon-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const pokemonId = card.getAttribute("data-id");
      openOverlay(pokemonId);
    });
  });
}

async function openOverlay(pokemonId) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokemon = await response.json();

    // Warten bis das Template fertig ist (async!)
    const overlayHTML = await getOverlayCardTemplate(pokemon);
    document.getElementById("overlayContent").innerHTML = overlayHTML;
    document.getElementById("overlay").classList.remove("hidden");
  } catch (error) {
    console.error("Fehler beim Öffnen des Overlays:", error);
  }
}

document.getElementById("overlay").addEventListener("click", (e) => {
  if (e.target.id === "overlay") {
    document.getElementById("overlay").classList.add("hidden");
  }
});

async function fetchMoveDetails(url) {
  const response = await fetch(url);
  return await response.json();
}

window.onload = init;
