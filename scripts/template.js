function getPokemonCardTemplate(pokemon) {
  return `
    <div class="pokemon-card">
      <h3>${pokemon.name.toUpperCase()}</h3>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    </div>
  `;
}
function getPokemonCardTemplate(pokemon) {
  let types = pokemon.types.map(t => `<span class="type-badge ${t.type.name}">${t.type.name.toUpperCase()}</span>`).join(" ");
  let bgColor = getTypeColor(pokemon.types[0].type.name);

  return `
    <div class="pokemon-card" style="background-color:${bgColor}">
      <div class="card-header">
        <h3>#${pokemon.id} ${pokemon.name.toUpperCase()}</h3>
      </div>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <div class="type-container">
        ${types}
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

