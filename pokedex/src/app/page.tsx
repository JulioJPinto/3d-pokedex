"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PokemonType {
  name: string;
}

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
}

export default function Home() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [types, setTypes] = useState<string[]>([]);

  // Fetch the list of Pokémon and types when the component mounts
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        const pokemonData = await Promise.all(data.results.map(async (pokemon: any, index: number) => {
          const res = await fetch(pokemon.url);
          const pokemonDetail = await res.json();
          return {
            id: index + 1,
            name: pokemon.name,
            sprites: {
              front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
            },
            types: pokemonDetail.types.map((typeInfo: any) => ({
              name: typeInfo.type.name
            }))
          };
        }));

        setPokemonList(pokemonData);

        // Extract and deduplicate types
        const typesSet = new Set<string>();
        pokemonData.forEach(pokemon => {
          pokemon.types.forEach(type => typesSet.add(type.name));
        });
        setTypes(Array.from(typesSet));
        
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
    };

    fetchPokemonList();
  }, []);

  // Filter Pokémon based on search term and selected type
  const filteredPokemon = pokemonList.filter(pokemon => {
    const searchTermLower = searchTerm.toLowerCase();
    const idMatch = pokemon.id.toString().includes(searchTermLower);
    const nameMatch = pokemon.name.toLowerCase().includes(searchTermLower);
    const typeMatch = !selectedType || pokemon.types.some(type => type.name === selectedType);

    return (idMatch || nameMatch) && typeMatch;
  });

  return (
    <main className='bg-white'>
      <div className='container mx-auto py-8 flex min-h-screen flex-col items-center justify-center'>
        <h1 className="text-4xl font-bold mb-4 text-black">Pokédex</h1>
        <div className="w-full max-w-5xl mb-8 flex flex-row gap-2">
            <input
              type="text"
              placeholder="Search Pokémon by name, number, or type..."
              className="w-full p-2 border rounded text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              id="type-filter"
              className="p-2 border rounded text-black"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl">
          {filteredPokemon.map(pokemon => (
            <Link key={pokemon.id} href={`/pokemon/${pokemon.id}`} className="group rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-100 transition">
              <Image
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                width={100}
                height={100}
                className="mx-auto mb-2"
              />
              <p className="text-sm text-gray-500">#{pokemon.id}</p>
              <p className="text-sm text-gray-500">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </p>
            </Link>
          ))}
        </div>
      </div>

        
    </main>
  );
}
