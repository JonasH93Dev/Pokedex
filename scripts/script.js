let offset = 0;
const limit = 20;

/**
 * Initializes the application:
 * - Loads the first batch of Pokémon
 * - Sets up the "Load More" button
 */
window.onload = async function () {
  showLoading();
  await loadPokemon();
  hideLoading();
  document.getElementById("loadMoreButton").onclick = loadMore;
};

/**
 * Handles live input in the search bar.
 * - If input is empty, resets to the default list
 * - If at least 3 characters are entered, fetches and displays matching Pokémon
 */
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

/**
 * Resets the Pokémon list to its default state (first page).
 */
async function resetToDefault() {
  offset = 0;
  let container = document.getElementById("pokemonList");
  container.innerHTML = "";
  showLoading();
  await loadPokemon();
  hideLoading();
  document.getElementById("loadMoreButton").style.display = "block";
}

/**
 * Fetches and filters Pokémon by name from the API.
 * @param {string} searchValue - The search string to match Pokémon names against.
 * @returns {Promise<Array>} A list of matching Pokémon.
 */
async function fetchAndFilterPokemon(searchValue) {
  let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  let allData = await response.json();
  return allData.results.filter(p => p.name.includes(searchValue));
}

/**
 * Renders the search results.
 * - Clears the Pokémon list
 * - Displays a message if no results are found
 * - Adds matching Pokémon to the list
 * @param {Array} matches - The list of matching Pokémon.
 */
async function renderSearchResults(matches) {
  let container = document.getElementById("pokemonList");
  container.innerHTML = "";

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

/**
 * Loads a batch of Pokémon based on the current offset and limit.
 */
async function loadPokemon() {
  let data = await fetchPokemonList();
  for (let p of data.results) {
    let details = await fetchPokemonDetails(p.url);
    addPokemonCard(details);
  }
  addCardClicks();
}

/**
 * Fetches a paginated list of Pokémon from the API.
 * @returns {Promise<Object>} The API response with Pokémon data.
 */
async function fetchPokemonList() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset;
  let response = await fetch(url);
  return await response.json();
}

/**
 * Fetches detailed information about a specific Pokémon.
 * @param {string} url - The Pokémon's API URL.
 * @returns {Promise<Object>} The detailed Pokémon data.
 */
async function fetchPokemonDetails(url) {
  let response = await fetch(url);
  return await response.json();
}

/**
 * Adds a Pokémon card to the list.
 * @param {Object} pokemon - The Pokémon data.
 */
function addPokemonCard(pokemon) {
  let container = document.getElementById("pokemonList");
  container.innerHTML += getPokemonCardTemplate(pokemon);
}

/**
 * Adds click events to Pokémon cards for opening the overlay.
 */
function addCardClicks() {
  let cards = document.querySelectorAll(".pokemon-card");
  cards.forEach(card => card.onclick = () => openOverlay(card.getAttribute("data-id")));
}

/**
 * Opens the Pokémon details overlay.
 * @param {number} id - The Pokémon ID.
 */
async function openOverlay(id) {
  currentPokemonId = id;
  let pokemon = await fetchPokemonDetails("https://pokeapi.co/api/v2/pokemon/" + id);
  let moves = await fetchFirstMoves(pokemon);
  showOverlay(pokemon, moves);
}

/**
 * Fetches details of the first two moves of a Pokémon.
 * @param {Object} pokemon - The Pokémon data.
 * @returns {Promise<Array>} A list of move details.
 */
async function fetchFirstMoves(pokemon) {
  let moves = [];
  for (let i = 0; i < 2 && i < pokemon.moves.length; i++) {
    let data = await fetch(pokemon.moves[i].move.url);
    moves.push(await data.json());
  }
  return moves;
}

/**
 * Displays the overlay with Pokémon details.
 * @param {Object} pokemon - The Pokémon data.
 * @param {Array} moves - The Pokémon's moves data.
 */
function showOverlay(pokemon, moves) {
  document.getElementById("overlayContent").innerHTML = getOverlayCardTemplate(pokemon, moves);
  document.getElementById("overlay").classList.remove("hidden");
}

/**
 * Closes the Pokémon details overlay.
 */
function closeOverlay() {
  document.getElementById("overlay").classList.add("hidden");
}

/**
 * Loads the next batch of Pokémon (increases offset).
 */
async function loadMore() {
  offset += limit;
  showLoading();
  await loadPokemon();
  hideLoading();
}

/**
 * Shows the loading overlay and disables the Load More button.
 */
function showLoading() {
  document.getElementById("loadingOverlay").classList.remove("hidden");
  let btn = document.getElementById("loadMoreButton");
  btn.disabled = true;
  btn.innerText = "Loading...";
}

/**
 * Hides the loading overlay and re-enables the Load More button.
 */
function hideLoading() {
  document.getElementById("loadingOverlay").classList.add("hidden");
  let btn = document.getElementById("loadMoreButton");
  btn.disabled = false;
  btn.innerText = "Load More";
}

let currentPokemonId = null;

/**
 * Opens the previous Pokémon in the overlay.
 */
async function prevPokemon() {
  if (currentPokemonId > 1) {
    openOverlay(currentPokemonId - 1);
  }
}

/**
 * Opens the next Pokémon in the overlay.
 */
async function nextPokemon() {
  openOverlay(currentPokemonId + 1);
}
