import { notFound } from 'next/navigation';
import ModelViewer from '../../../components/ModelViewer'; // Ensure the path is correct

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
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch Pokémon');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    notFound();
  }
};

export default async function PokemonPage({ params }: { params: { id: string } }) {
  try {
    const pokemon = await fetchPokemon(params.id);
    return (
      <div className='bg-white h-full'>
        <h1 className='text-black'>{pokemon.name}</h1>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        <p className='text-black'>Height: {pokemon.height}</p>
        <p className='text-black'>Weight: {pokemon.weight}</p>
        <ModelViewer modelPath={`/models/${params.id}/model.dae`} />

      </div>
    );
  } catch (error) {
    notFound();
  }
}
