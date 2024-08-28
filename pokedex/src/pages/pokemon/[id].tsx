// src/pages/pokemon/[id].js

export async function getStaticPaths() {

    // 1st Generation of Pokémon
    const paths = Array.from({ length: 151 }, (_, index) => ({
      params: { id: (index + 1).toString() },
    }));
  
    return { paths, fallback: false };
  }
  
  export async function getStaticProps({ params }) {
    const id = params.id;
    
    // Fetch the specific Pokémon using the ID from the URL
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await res.json();
  
    return { props: { pokemon } };
  }
  
  const PokemonPage = ({ pokemon }) => {
    return (
      <div>
        <h1>{pokemon.name}</h1>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        <p>Height: {pokemon.height}</p>
        <p>Weight: {pokemon.weight}</p>
      </div>
    );
  };
  
  export default PokemonPage;
  