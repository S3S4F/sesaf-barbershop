const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;

const fallbackByName: Record<string, string> = {
  "Coupe Simple": unsplash("1504257432389-52343af06ae3"),
  "Taper": unsplash("1621605815971-fbc98d665033"),
  "Dégradé": unsplash("1605497788044-5a32c7078486"),
  "Dégradé + Barbe": unsplash("1599351431202-1e0f0137899a"),
  "Dégradé + Design": unsplash("1635273051839-003bf06a8751"),
  "Coupe Afro": unsplash("1580618672591-eb180b1a973f"),
  "Taille de Barbe": unsplash("1519699047748-de8e457a634e"),
  "Rasage Complet": unsplash("1622286342621-4bd786c2447c"),
};

const genericFallback = unsplash("1504257432389-52343af06ae3");

export function resolveServiceImage(
  name: string,
  imageUrl: string | null | undefined
): string {
  if (imageUrl && imageUrl.length > 0) return imageUrl;
  return fallbackByName[name] ?? genericFallback;
}
