import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  StatusBar,
} from "react-native";
import { fetchPokemonList, fetchPokemonDetails } from "../services/api";
import PokemonCard from "../components/PokemonCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const PAGE_SIZE = 151;

const HomeScreen = ({ navigation }) => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadPokemons = useCallback(async (reset = false) => {
    try {
      const listData = await fetchPokemonList(PAGE_SIZE, 0);

      const detailsPromises = listData.results.map((p) =>
        fetchPokemonDetails(p.name),
      );
      const details = await Promise.all(detailsPromises);

      const pokemons = details.map((d) => ({
        id: d.id,
        name: d.name,
        image:
          d.sprites?.other?.["official-artwork"]?.front_default ||
          d.sprites?.front_default ||
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${d.id}.png`,
        types: d.types.map((t) => t.type.name),
      }));

      setAllPokemons(pokemons);
      setFilteredPokemons(pokemons);
    } catch (err) {
      setError("Não foi possível carregar os Pokémons. Verifique sua conexão.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPokemons(true);
  }, [loadPokemons]);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredPokemons(allPokemons);
    } else {
      const query = searchText.toLowerCase().trim();
      const filtered = allPokemons.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          String(p.id).padStart(3, "0").includes(query),
      );
      setFilteredPokemons(filtered);
    }
  }, [searchText, allPokemons]);

  const handleRefresh = () => {
    setRefreshing(true);
    setSearchText("");
    loadPokemons(true);
  };

  if (loading) return <LoadingSpinner message="Carregando Pokédex..." />;
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => {
          setLoading(true);
          setError(null);
          loadPokemons(true);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <FlatList
        data={filteredPokemons}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1D3E35"
          />
        }
        ListHeaderComponent={
          <View style={styles.headerWrapper}>
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.mainTitle}>Pokédex</Text>
                <Text style={styles.subTitle}>
                  Seu próximo encontro começa aqui.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.pokeballButton}
                activeOpacity={0.8}
              >
                <View style={styles.pokeballOuter}>
                  <View style={styles.pokeballInner} />
                  <View style={styles.pokeballLine} />
                  <View style={styles.pokeballCenterDot} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar Pokémon por nome..."
                placeholderTextColor="#9AA5A0"
                value={searchText}
                onChangeText={setSearchText}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchText("")}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.filtersRow}>
              <View style={styles.filtersLeft}>
                <View style={styles.regionPill}>
                  <Text style={styles.regionPillText}>Kanto</Text>
                </View>
                <Text style={styles.pokemonCountText}>
                  {filteredPokemons.length} Pokémon
                </Text>
              </View>

              <TouchableOpacity
                style={styles.filterSlidersBtn}
                activeOpacity={0.7}
              >
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderLine, { width: 18 }]} />
                  <View style={[styles.sliderDot, { left: 4 }]} />
                </View>
                <View style={[styles.sliderTrack, { marginTop: 4 }]}>
                  <View style={[styles.sliderLine, { width: 18 }]} />
                  <View style={[styles.sliderDot, { left: 11 }]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={() =>
              navigation.navigate("Profile", {
                pokemonId: item.id,
                pokemonName: item.name,
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔎</Text>
            <Text style={styles.emptyTitle}>Nenhum Pokémon encontrado</Text>
            <Text style={styles.emptyText}>
              Não encontramos nenhum resultado para "{searchText}".
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    backgroundColor: "#FFFFFF",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  headerWrapper: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#132320",
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 14.5,
    color: "#768580",
    marginTop: 4,
    fontWeight: "400",
  },
  pokeballButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#E4F3EB",
    justifyContent: "center",
    alignItems: "center",
  },
  pokeballOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#245642",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  pokeballInner: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  pokeballLine: {
    position: "absolute",
    width: 24,
    height: 2,
    backgroundColor: "#245642",
  },
  pokeballCenterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#245642",
    backgroundColor: "#E4F3EB",
    zIndex: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: "#ECEFEF",
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14.5,
    color: "#162824",
    fontWeight: "500",
  },
  clearIcon: {
    fontSize: 14,
    color: "#9AA5A0",
    padding: 4,
  },
  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  filtersLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  regionPill: {
    backgroundColor: "#162824",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  regionPillText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  pokemonCountText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#65736E",
  },
  filterSlidersBtn: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderTrack: {
    width: 18,
    height: 8,
    justifyContent: "center",
    position: "relative",
  },
  sliderLine: {
    height: 2,
    backgroundColor: "#43524E",
    borderRadius: 1,
  },
  sliderDot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#43524E",
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1B2C27",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "#768580",
    textAlign: "center",
  },
});

export default HomeScreen;
