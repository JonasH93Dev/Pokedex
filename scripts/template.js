/**
 * Returns a color code for the given Pokémon type.
 * @param {string} type - The Pokémon type (e.g., "fire", "water").
 * @returns {string} - The corresponding hex color code.
 */
function getTypeColor(type) {
  const colors = {
    normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
    grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
    ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
    rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
    steel: "#B7B7CE", fairy: "#D685AD"
  };
  return colors[type] || "#68A090";
}

/**
 * Generates the HTML template for a single Pokémon card.
 * @param {Object} pokemon - The Pokémon object containing its data.
 * @param {number} pokemon.id - The Pokémon's ID.
 * @param {string} pokemon.name - The Pokémon's name.
 * @param {Array} pokemon.types - The Pokémon's type objects.
 * @param {Object} pokemon.sprites - The Pokémon's sprite images.
 * @returns {string} - The HTML string for the Pokémon card.
 */
function getPokemonCardTemplate(pokemon) {
  const types = pokemon.types.map(t => t.type.name);
  const bgColor = getTypeColor(types[0]);
  return `
    <div class="pokemon-card" data-id="${pokemon.id}" style="background-color:${bgColor}">
      <h3>#${pokemon.id} ${pokemon.name.toUpperCase()}</h3>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <div class="type-badges">
        ${types.map(t => `<span class="type-badge" style="background-color:${getTypeColor(t)}">${t.toUpperCase()}</span>`).join("")}
      </div>
    </div>
  `;
}

/**
 * Generates the HTML template for the Pokémon TCG-style overlay card.
 * Includes Pokémon stats, types, moves, and navigation buttons.
 * @param {Object} pokemon - The Pokémon object containing its data.
 * @param {number} pokemon.id - The Pokémon's ID.
 * @param {string} pokemon.name - The Pokémon's name.
 * @param {Array} pokemon.types - The Pokémon's type objects.
 * @param {Object} pokemon.sprites - The Pokémon's sprite images.
 * @param {Array} moves - Array of the Pokémon's first move objects.
 * @returns {string} - The HTML string for the overlay card.
 */
function getOverlayCardTemplate(pokemon, moves) {
  const bgColor = getTypeColor(pokemon.types[0].type.name);
  return `
    <div class="pokemon-tcg-card" style="background:${bgColor}; position: relative;">
      <span class="close-btn" onclick="closeOverlay()">×</span>
      <div class="card-top">
        <span class="card-name">${pokemon.name.toUpperCase()}</span>
        <span class="card-hp">HP ${pokemon.stats[0].base_stat}</span>
      </div>
      <div class="card-image-container">
        <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
      </div>
      <div class="card-info">
        <div class="types">
          ${pokemon.types.map(t => `<span class="type-badge" style="background-color:${getTypeColor(t.type.name)}">${t.type.name.toUpperCase()}</span>`).join('')}
        </div>
        <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
        <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
        <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
        ${moves.map(m => `
          <div class="attack">
            <strong>${m.name.toUpperCase()} - Power: ${m.power || 'N/A'}</strong>
            <p>${m.effect_entries[0]?.short_effect || 'No description available.'}</p>
          </div>
        `).join('')}
      </div>
      <div class="overlay-nav">
        <button class="nav-btn prev" onclick="prevPokemon()">&#8592;</button>
        <button class="nav-btn next" onclick="nextPokemon()">&#8594;</button>
      </div>
    </div>
  `;
}
