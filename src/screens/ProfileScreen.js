import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from "react-native";
import { fetchPokemonDetails, fetchMoveDetails } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { getTypeColor } from "../constants/typeColors";

const ProfileScreen = ({ route, navigation }) => {
  const { pokemonId, pokemonName } = route.params;

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moveTypes, setMoveTypes] = useState({});
  const [moveSearch, setMoveSearch] = useState("");
  const bulbasaurMoveOrder = [
    "solar-beam",
    "vine-whip",
    "razor-leaf",
    "sludge-bomb",
    "tackle",
    "growl",
    "leech-seed",
    "growth",
    "poison-powder",
    "sleep-powder",
  ];

  const loadPokemon = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPokemonDetails(pokemonId || pokemonName);
      setPokemon(data);
      const moveDetails = await Promise.all(
        data.moves.map((item) =>
          fetchMoveDetails(item.move.url).catch(() => null),
        ),
      );
      const types = {};
      moveDetails.forEach((move, index) => {
        if (move?.type?.name) {
          types[data.moves[index].move.name] = move.type.name;
        }
      });
      setMoveTypes(types);
    } catch (err) {
      setError("Não foi possível carregar os dados do Pokémon.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPokemon();
  }, [pokemonId]);

  if (loading) return <LoadingSpinner message="Carregando Pokémon..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadPokemon} />;
  if (!pokemon) return null;

  const primaryType = pokemon.types[0]?.type.name || "normal";
  const headerBgColor = getTypeColor(primaryType) + "55";
  const image =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  const formatName = (name) =>
    name.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  const visibleMoves =
    Number(pokemon.id) === 1
      ? (() => {
          const priority = bulbasaurMoveOrder
            .map((name) =>
              pokemon.moves.find((item) => item.move.name === name),
            )
            .filter(Boolean);
          const remaining = pokemon.moves
            .filter((item) => !bulbasaurMoveOrder.includes(item.move.name))
            .slice(0, 48 - priority.length);
          return [...priority, ...remaining];
        })()
      : pokemon.moves.slice(0, 48);

  const moves = visibleMoves.filter((item) =>
    formatName(item.move.name)
      .toLowerCase()
      .includes(moveSearch.toLowerCase().trim()),
  );

  const ability =
    pokemon.abilities.find((item) => !item.is_hidden)?.ability.name ||
    pokemon.abilities[0]?.ability.name ||
    "—";

  const ListHeader = () => (
    <View style={styles.topSection}>
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.brand}>POKÉDEX</Text>
        <Text style={styles.pokemonId}>
          #{String(pokemon.id).padStart(3, "0")}
        </Text>
      </View>

      <Text style={styles.pokemonName}>
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </Text>

      <View style={styles.typesRow}>
        {pokemon.types.map((t) => (
          <View
            key={t.type.name}
            style={[
              styles.typeBadge,
              t.type.name === "grass"
                ? styles.grassBadge
                : t.type.name === "poison"
                  ? styles.poisonBadge
                  : { backgroundColor: getTypeColor(t.type.name) },
            ]}
          >
            <Text style={styles.typeText}>
              {t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}
            </Text>
          </View>
        ))}
      </View>

      <Image
        source={{ uri: image }}
        style={styles.pokemonImage}
        resizeMode="contain"
      />

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>
            {(pokemon.weight / 10).toFixed(1).replace(".", ",")} kg
          </Text>
          <Text style={styles.infoLabel}>Peso</Text>
        </View>
        <View style={styles.infoSeparator} />
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>
            {(pokemon.height / 10).toFixed(1).replace(".", ",")} m
          </Text>
          <Text style={styles.infoLabel}>Altura</Text>
        </View>
        <View style={styles.infoSeparator} />
        <View style={styles.infoItem}>
          <Text style={styles.infoValue} numberOfLines={1}>
            {formatName(ability)}
          </Text>
          <Text style={styles.infoLabel}>Habilidade</Text>
        </View>
      </View>

      <View style={styles.movesHeadingRow}>
        <Text style={styles.sectionTitle}>Movimentos</Text>
        <View style={styles.movesSubtitle}>
          <Text style={styles.movesSubtitleText}>(Moves)</Text>
        </View>
        <Text style={styles.moveCount}>48</Text>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Filtrar movimentos..."
          placeholderTextColor="#9CA3AF"
          value={moveSearch}
          onChangeText={setMoveSearch}
          autoCorrect={false}
        />
        <View style={styles.filterIcon}>
          <View style={styles.filterLine}>
            <View style={styles.filterDotLeft} />
          </View>
          <View style={styles.filterLine}>
            <View style={styles.filterDotRight} />
          </View>
        </View>
      </View>
    </View>
  );

  const renderMoveItem = ({ item }) => {
    const moveName = item.move.name;
    const moveUrl = item.move.url;
    const moveId = moveUrl.split("/").filter(Boolean).pop();

    const moveType = moveTypes[moveName];

    return (
      <TouchableOpacity
        style={styles.moveItem}
        onPress={() =>
          navigation.navigate("MoveDetails", {
            moveId,
            moveName,
            pokemonId: pokemon.id,
            pokemonName: pokemon.name,
          })
        }
        activeOpacity={0.7}
      >
        <Text style={styles.moveName}>{formatName(moveName)}</Text>
        {moveType && (
          <View
            style={[
              styles.moveTypeBadge,
              moveType === "grass"
                ? styles.grassMoveBadge
                : moveType === "poison"
                  ? styles.poisonMoveBadge
                  : { backgroundColor: "#E5E7EB" },
            ]}
          >
            <Text style={styles.moveTypeText}>
              {moveType.charAt(0).toUpperCase() + moveType.slice(1)}
            </Text>
          </View>
        )}
        <Text style={styles.moveArrow}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={moves}
        keyExtractor={(item) => item.move.name}
        renderItem={renderMoveItem}
        ListHeaderComponent={<ListHeader />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topSection: {
    backgroundColor: "#FFFFFF",
  },
  navRow: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F2F3F3",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  backButtonText: {
    fontSize: 34,
    lineHeight: 36,
    color: "#26323F",
    marginTop: -5,
  },
  brand: {
    color: "#263238",
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: "700",
  },
  pokemonId: {
    fontSize: 16,
    color: "#26323F",
    fontWeight: "700",
  },
  pokemonImage: {
    width: 190,
    height: 150,
    alignSelf: "center",
    marginTop: -18,
    marginBottom: -2,
  },
  pokemonName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginTop: 0,
  },
  typesRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  typeBadge: {
    minWidth: 62,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  grassBadge: {
    backgroundColor: "#3AB27A",
  },
  poisonBadge: {
    backgroundColor: "#A35BB2",
  },
  typeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 22,
    height: 54,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F4F5F5",
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    maxWidth: 110,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 5,
  },
  infoSeparator: {
    width: 1,
    height: 52,
    backgroundColor: "#E5E7EB",
  },
  movesHeadingRow: {
    height: 52,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EDEF",
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#1F2937",
  },
  movesSubtitle: {
    backgroundColor: "#F6F7F7",
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 27,
    justifyContent: "center",
    marginLeft: 8,
    marginBottom: 0,
  },
  movesSubtitleText: {
    color: "#777F84",
    fontSize: 12,
  },
  moveCount: {
    marginLeft: "auto",
    color: "#26323F",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },
  searchBar: {
    height: 66,
    marginHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF0F0",
  },
  searchIcon: {
    fontSize: 22,
    color: "#697277",
    transform: [{ rotate: "-20deg" }],
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: "#374151",
    fontSize: 14,
  },
  filterIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
  },
  filterLine: {
    height: 2,
    width: 20,
    backgroundColor: "#9AA2A6",
    marginVertical: 4,
  },
  filterDotLeft: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#26323F",
    marginLeft: 3,
    marginTop: -2,
  },
  filterDotRight: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#26323F",
    marginLeft: 13,
    marginTop: -2,
  },
  listContent: {
    paddingBottom: 24,
  },
  moveItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 18,
    height: 57,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F1",
  },
  moveName: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "700",
    flex: 1,
  },
  moveTypeBadge: {
    minWidth: 66,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  grassMoveBadge: {
    backgroundColor: "#D7EAD9",
  },
  poisonMoveBadge: {
    backgroundColor: "#E6D9E9",
  },
  moveTypeText: {
    color: "#35503F",
    fontSize: 11,
    fontWeight: "700",
  },
  moveArrow: {
    fontSize: 24,
    color: "#26323F",
    fontWeight: "300",
  },
});

export default ProfileScreen;
