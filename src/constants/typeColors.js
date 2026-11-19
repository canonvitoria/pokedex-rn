export const TYPE_COLORS = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export const TYPE_CARD_BG = {
  grass: "#EAF6EE",
  fire: "#FDEEE7",
  water: "#E8F1FB",
  electric: "#FEF7DA",
  poison: "#F5ECFA",
  bug: "#F2F6DC",
  normal: "#F4F4F1",
  ground: "#F8F3E4",
  fairy: "#FDEEF2",
  fighting: "#F9EAE9",
  psychic: "#FDEBF2",
  rock: "#F4F0E0",
  ghost: "#EFEAF5",
  ice: "#EBF8F8",
  dragon: "#EDE7FD",
  dark: "#EFECEB",
  steel: "#EDEDF4",
  flying: "#F0EDFD",
};

export const TYPE_BADGE_THEME = {
  grass: { bg: "#D2EBD9", text: "#21633F" },
  poison: { bg: "#EBDDF3", text: "#763B8F" },
  fire: { bg: "#FCDACA", text: "#B54921" },
  water: { bg: "#D1E4FA", text: "#2162A5" },
  electric: { bg: "#FCEEB2", text: "#8F710A" },
  bug: { bg: "#E3EBB7", text: "#5D6D17" },
  normal: { bg: "#E4E4D7", text: "#676747" },
  ground: { bg: "#EDE1BD", text: "#846E26" },
  fairy: { bg: "#FBD7E1", text: "#B54562" },
  fighting: { bg: "#F1CDCA", text: "#8A221C" },
  psychic: { bg: "#FBD3E3", text: "#AC225A" },
  rock: { bg: "#E5DDBE", text: "#786B32" },
  ghost: { bg: "#DDD3E9", text: "#533878" },
  ice: { bg: "#D3EDED", text: "#3B7E7E" },
  dragon: { bg: "#DACDFB", text: "#4F26B7" },
  dark: { bg: "#DCD4D1", text: "#54443E" },
  steel: { bg: "#D8D8E5", text: "#5A5A7A" },
  flying: { bg: "#DDD6FA", text: "#5641AC" },
};

export const getTypeColor = (type) =>
  TYPE_COLORS[type?.toLowerCase()] || "#A8A878";

export const getCardBgColor = (type) =>
  TYPE_CARD_BG[type?.toLowerCase()] || "#F3F4F6";

export const getBadgeTheme = (type) =>
  TYPE_BADGE_THEME[type?.toLowerCase()] || { bg: "#E5E7EB", text: "#374151" };
