import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { getCardBgColor, getBadgeTheme } from "../constants/typeColors";

const PokemonCard = ({ pokemon, onPress }) => {
  const primaryType = pokemon.types?.[0] || "normal";
  const cardBg = getCardBgColor(primaryType);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBg }]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      <View style={styles.topInfo}>
        <Text style={styles.pokemonId}>
          #{String(pokemon.id).padStart(3, "0")}
        </Text>
        <Text style={styles.pokemonName} numberOfLines={1}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pokemon.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.badgesContainer}>
        {pokemon.types?.map((type) => {
          const theme = getBadgeTheme(type);
          return (
            <View
              key={type}
              style={[styles.typeBadge, { backgroundColor: theme.bg }]}
            >
              <Text style={[styles.typeText, { color: theme.text }]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
    minHeight: 200,
    justifyContent: "space-between",
  },
  topInfo: {
    alignItems: "flex-start",
  },
  pokemonId: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7B8A85",
    letterSpacing: 0.2,
  },
  pokemonName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#152421",
    marginTop: 2,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  image: {
    width: 106,
    height: 106,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
    marginTop: 4,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 9,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

export default PokemonCard;
