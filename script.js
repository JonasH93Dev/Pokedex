let offset = 0;
const limit = 20;
let loadedPokemon = []; // Stores all currently displayed Pokémon
let currentIndex = 0;   // Index of the currently opened Pokémon

window.onload = async function () {
  showLoading();
  await loadPokemon();
  hideLoading();
  document.getElementById("loadMoreButton").onclick = loadMore;
};

/**
 * Handles live search input.
 */
async function handleSearchInput() {
  const value = document.getElementById("searchInput").value.trim().toLowerCase();
  if (value.length === 0) {
    resetToDefault();
    return;
  }
  if (value.length >= 3) {
    showLoading();
    const matches = await fetchAndFilterPokemon(value);
    await renderSearchResults(matches);
    hideLoading();
    document.getElementById("loadMoreButton").style.display = "none";
  }
}

/**
 * Resets to the default Pokémon list.
 */
async function resetToDefault() {
  offset = 0;
  loadedPokemon = [];
  const container = document.getElementById("pokemonList");
  container.innerHTML = "";
  showLoading();
  await loadPokemon();
  hideLoading();
  document.getElementById("loadMoreButton").style.display = "block";
}

/**
 * Fetches and filters Pokémon based on search input.
 * @param {string} searchValue - The search term.
 * @returns {Array} Filtered Pokémon.
 */
async function fetchAndFilterPokemon(searchValue) {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const allData = await response.json();
  return allData.results.filter(p => p.name.includes(searchValue));
}

/**
 * Renders search results.
 * @param {Array} matches - Array of matched Pokémon.
 */
async function renderSearchResults(matches) {
  const container = document.getElementById("pokemonList");
  container.innerHTML = "";
  loadedPokemon = [];

  if (matches.length === 0) {
    container.innerHTML = "<p style='text-align:center; font-size:18px; padding:20px;'>No Pokémon found.</p>";
    return;
  }

  for (const p of matches) {
    const detail = await fetchPokemonDetails(p.url);
    addPokemonCard(detail);
  }
  addCardClicks();
}

/**
 * Loads Pokémon from the API.
 */
async function loadPokemon() {
  const data = await fetchPokemonList();
  for (const p of data.results) {
    const details = await fetchPokemonDetails(p.url);
    addPokemonCard(details);
  }
  addCardClicks();
}

/**
 * Fetches Pokémon list with limit and offset.
 * @returns {Object} Pokémon list data.
 */
async function fetchPokemonList() {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset;
  const response = await fetch(url);
  return await response.json();
}

/**
 * Fetches detailed Pokémon data.
 * @param {string} url - API URL for Pokémon.
 * @returns {Object} Pokémon data.
 */
async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  return await response.json();
}

/**
 * Adds a Pokémon card to the list.
 * @param {Object} pokemon - Pokémon data.
 */
function addPokemonCard(pokemon) {
  const container = document.getElementById("pokemonList");
  container.innerHTML += getPokemonCardTemplate(pokemon);
  loadedPokemon.push(pokemon);
}

/**
 * Adds click events to Pokémon cards.
 */
function addCardClicks() {
  const cards = document.querySelectorAll(".pokemon-card");
  cards.forEach(card => card.onclick = () => openOverlay(card.getAttribute("data-id")));
}

/**
 * Opens the overlay with detailed Pokémon data.
 * @param {number} id - Pokémon ID.
 */
async function openOverlay(id) {
  const index = loadedPokemon.findIndex(p => p.id == id);
  if (index !== -1) {
    currentIndex = index;
  }
  const pokemon = await fetchPokemonDetails("https://pokeapi.co/api/v2/pokemon/" + id);
  const moves = await fetchFirstMoves(pokemon);
  showOverlay(pokemon, moves);
}

/**
 * Fetches first two moves for the Pokémon.
 * @param {Object} pokemon - Pokémon data.
 * @returns {Array} Array of move data.
 */
async function fetchFirstMoves(pokemon) {
  const moves = [];
  for (let i = 0; i < 2 && i < pokemon.moves.length; i++) {
    const data = await fetch(pokemon.moves[i].move.url);
    moves.push(await data.json());
  }
  return moves;
}

/**
 * Displays the overlay with Pokémon details.
 * @param {Object} pokemon - Pokémon data.
 * @param {Array} moves - Pokémon moves.
 */
function showOverlay(pokemon, moves) {
  document.getElementById("overlayContent").innerHTML = getOverlayCardTemplate(pokemon, moves);
  document.getElementById("overlay").classList.remove("hidden");

  // Hide prev button if first Pokémon
  const prevBtn = document.querySelector(".nav-btn.prev");
  if (prevBtn) {
    prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
  }

  // Hide next button if last Pokémon
  const nextBtn = document.querySelector(".nav-btn.next");
  if (nextBtn) {
    nextBtn.style.display = currentIndex === loadedPokemon.length - 1 ? "inline-block" : "inline-block";
  }
}

/**
 * Closes the overlay.
 */
function closeOverlay() {
  document.getElementById("overlay").classList.add("hidden");
}

/**
 * Goes to the previous Pokémon in the overlay.
 */
async function prevPokemon() {
  if (currentIndex > 0) {
    currentIndex--;
    openOverlay(loadedPokemon[currentIndex].id);
  }
}

/**
 * Goes to the next Pokémon in the overlay.
 * Loads more Pokémon if the current one is the last in the loaded list.
 */
async function nextPokemon() {
  if (currentIndex < loadedPokemon.length - 1) {
    currentIndex++;
    openOverlay(loadedPokemon[currentIndex].id);
  } else {
    // Load more if at the last Pokémon
    await loadMore();
    currentIndex++;
    openOverlay(loadedPokemon[currentIndex].id);
  }
}

/**
 * Loads more Pokémon and appends them to the list.
 */
async function loadMore() {
  offset += limit;
  showLoading();
  await loadPokemon();
  hideLoading();
}

/**
 * Shows the loading overlay and disables the button.
 */
function showLoading() {
  document.getElementById("loadingOverlay").classList.remove("hidden");
  const btn = document.getElementById("loadMoreButton");
  btn.disabled = true;
  btn.innerText = "Loading...";
}

/**
 * Hides the loading overlay and enables the button.
 */
function hideLoading() {
  document.getElementById("loadingOverlay").classList.add("hidden");
  const btn = document.getElementById("loadMoreButton");
  btn.disabled = false;
  btn.innerText = "Load More";
}
