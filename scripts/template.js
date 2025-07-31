function getPokemonCardTemplate(pokemon) {
  let types = pokemon.types.map(t => `<span class="type-badge ${t.type.name}">${t.type.name.toUpperCase()}</span>`).join(" ");
  return `
    <div class="pokemon-card" data-id="${pokemon.id}">
      <div class="card-header">
        <span class="pokemon-id">#${pokemon.id}</span>
        <h3 class="pokemon-name">${pokemon.name.toUpperCase()}</h3>
      </div>
      <div class="image-container">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      </div>
      <div class="type-container">
        ${types}
      </div>
    </div>
  `;
}

function getOverlayCardTemplate(pokemon, moves) {
  let attacksHTML = "";
  for (let move of moves) {
    let description = move.effect_entries.find(e => e.language.name === "en")?.short_effect || "No description";
    attacksHTML += `
      <div class="attack">
        <div class="attack-header">
          <span class="attack-name">${move.name.toUpperCase()}</span>
          <span class="attack-damage">${move.power ? move.power : "—"}</span>
        </div>
        <p class="attack-text">${description}</p>
      </div>
    `;
  }

  return `
    <div class="pokemon-tcg-card">
      <div class="card-top">
        <span class="card-name">${pokemon.name.toUpperCase()}</span>
        <span class="card-hp">HP ${pokemon.stats[0].base_stat}</span>
      </div>
      <div class="card-image-container">
        <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
      </div>
      <div class="card-attack-section">
        ${attacksHTML}
      </div>
      <div class="card-info">
        <p><strong>Height:</strong> ${(pokemon.height / 10).toFixed(1)} m</p>
        <p><strong>Weight:</strong> ${(pokemon.weight / 10).toFixed(1)} kg</p>
      </div>
    </div>
  `;
}
