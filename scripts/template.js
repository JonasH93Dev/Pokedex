function getPokemonCardTemplate(pokemon) {
  return `
    <div class="pokemon-card">
      <h3>${pokemon.name.toUpperCase()}</h3>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    </div>
  `;
}
