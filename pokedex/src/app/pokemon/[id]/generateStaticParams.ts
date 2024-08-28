// app/pokemon/[id]/generateStaticParams.ts
export async function generateStaticParams() {
    // Generate paths for the first 151 Pokémon
    const paths = Array.from({ length: 151 }, (_, index) => ({
      id: (index + 1).toString(),
    }));
  
    return { paths };
  }
  