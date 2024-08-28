// app/pokemon/[id]/page.tsx
import { notFound } from 'next/navigation';

interface PokemonProps {
  pokemon: {
    name: string;
    sprites: {
      front_default: string;
    };
    height: number;
    weight: number;
  };
}

const fetchPokemon = async (id: string) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) {
    // Handle errors (e.g., Pokémon not found)
    throw new Error('Failed to fetch Pokémon');
  }
  return res.json();
};

export default async function PokemonPage({ params }: { params: { id: string } }) {
  try {
    const pokemon = await fetchPokemon(params.id);
    return (
      <div>
        <h1>{pokemon.name}</h1>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        <p>Height: {pokemon.height}</p>
        <p>Weight: {pokemon.weight}</p>
      </div>
    );
  } catch (error) {
    // Handle errors or show a 404 page
    notFound();
  }
}
