async function fetchMoveDetails(url) {
  const response = await fetch(url);
  return await response.json();
}

function getPokemonCardTemplate(pokemon) {
  let types = pokemon.types.map(
    t => `<span class="type-badge ${t.type.name}">${t.type.name.toUpperCase()}</span>`
  ).join(" ");
  let bgColor = getTypeColor(pokemon.types[0].type.name);

  return `
    <div class="pokemon-card" data-id="${pokemon.id}" style="background-color:${bgColor}">
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

async function getOverlayCardTemplate(pokemon) {
  let types = pokemon.types.map(
    t => `<span class="type-badge ${t.type.name}">${t.type.name.toUpperCase()}</span>`
  ).join(" ");


  let moves = await Promise.all(
    pokemon.moves.slice(0, 2).map(async (m) => await fetchMoveDetails(m.move.url))
  );

  let attacks = moves.map(move => `
    <div class="attack">
      <div class="attack-header">
        <span class="attack-name">${move.name.toUpperCase()}</span>
        <span class="attack-damage">${move.power ? move.power : "-"}</span>
      </div>
      <p class="attack-text">${move.effect_entries.find(e => e.language.name === "en")?.short_effect || "No description available."}</p>
    </div>
  `).join("");

  let flavorText = `This Pokémon is known for its unique abilities and characteristics.`;

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
        ${attacks}
      </div>
      <div class="card-info">
        <div class="types">${types}</div>
        <p class="flavor-text">${flavorText}</p>
        <p><strong>Height:</strong> ${(pokemon.height / 10).toFixed(1)} m</p>
        <p><strong>Weight:</strong> ${(pokemon.weight / 10).toFixed(1)} kg</p>
      </div>
    </div>
  `;
}

function getTypeColor(type) {
  const colors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD"
  };
  return colors[type] || "#68A090";
}
