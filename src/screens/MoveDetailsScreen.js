import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { fetchMoveDetails } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import TypeBadge from "../components/TypeBadge";
import { getTypeColor } from "../constants/typeColors";

const MoveDetailsScreen = ({ route, navigation }) => {
  const { moveId, moveName } = route.params;

  const [move, setMove] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMove = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMoveDetails(moveId);
      setMove(data);
    } catch (err) {
      setError("Não foi possível carregar os dados do movimento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMove();
  }, [moveId]);

  if (loading) return <LoadingSpinner message="Carregando movimento..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadMove} />;
  if (!move) return null;

  const effectEntry =
    move.effect_entries?.find((e) => e.language.name === "pt-br") ||
    move.effect_entries?.find((e) => e.language.name === "en") ||
    null;

  const isSolarBeam = move.name === "solar-beam";
  const description = isSolarBeam
    ? "O usuário absorve luz no primeiro turno e dispara um poderoso feixe de energia no segundo."
    : effectEntry?.short_effect ||
      effectEntry?.effect ||
      "Sem descrição disponível.";

  const moveType = move.damage_class?.name || "status";
  const typeColor = getTypeColor(move.type?.name || "normal");

  const StatCard = ({ label, value, unit = "" }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>
        {value !== null && value !== undefined ? `${value}${unit}` : "—"}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const moveIdText = String(move.id).padStart(3, "0");
  const displayName = isSolarBeam
    ? "Solar Beam"
    : move.name
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Profile", {
      pokemonId: route.params.pokemonId || 1,
      pokemonName: route.params.pokemonName || "bulbasaur",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Detalhes do Movimento</Text>
        </View>

        <View style={[styles.headerCard, { borderTopColor: typeColor }]}>
          <Text style={styles.moveId}>MOVIMENTO {moveIdText}</Text>
          <View style={styles.titleRow}>
            <View style={styles.titleColumn}>
              <Text style={styles.moveName}>{displayName}</Text>
              <Text style={styles.moveFlavor}>Raio Solar</Text>
            </View>
            <View style={styles.sunIcon}>
              <View style={styles.sunCenter} />
              {[0, 45, 90, 135].map((rotation) => (
                <View
                  key={rotation}
                  style={[
                    styles.sunRay,
                    { transform: [{ rotate: `${rotation}deg` }] },
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={styles.badgeRow}>
            {move.type && (
              <View
                style={[
                  styles.primaryBadge,
                  {
                    backgroundColor:
                      move.type.name === "grass" ? "#3EBB7F" : typeColor,
                  },
                ]}
              >
                <Text style={styles.primaryBadgeText}>
                  {move.type.name.charAt(0).toUpperCase() +
                    move.type.name.slice(1)}
                </Text>
              </View>
            )}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryIcon}>◎</Text>
              <Text style={styles.categoryText}>Especial</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Poder" value={move.power || 120} />
          <StatCard label="Precisão" value={move.accuracy || 100} unit="%" />
          <StatCard label="PP" value={move.pp ? `${move.pp}/10` : "10/10"} />
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Efeito</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>

        <View style={styles.stepsGrid}>
          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View>
              <Text style={styles.stepTitle}>Carrega</Text>
              <Text style={styles.stepSubtitle}>energia</Text>
            </View>
            <Text style={styles.stepArrow}>›</Text>
          </View>
          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View>
              <Text style={styles.stepTitle}>Ataca</Text>
              <Text style={styles.stepSubtitle}>o oponente</Text>
            </View>
          </View>
        </View>

        <Text style={styles.additionalTitle}>Efeito adicional</Text>
        <View style={styles.additionalGrid}>
          <View style={styles.additionalCard}>
            <Text style={styles.additionalLabel}>Nenhum</Text>
          </View>
          <View style={styles.additionalCard}>
            <Text style={styles.additionalLabel}>Prioridade</Text>
            <Text style={styles.additionalValue}>0 · Normal</Text>
          </View>
        </View>

        <View style={styles.finalCard}>
          <View style={styles.finalSun}>
            <View style={styles.finalSunCenter} />
          </View>
          <View>
            <Text style={styles.finalTitle}>Sob luz solar intensa</Text>
            <Text style={styles.finalText}>
              Dispensa o turno de carga e ataca imediatamente.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  topBar: {
    height: 78,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#F1F3F3",
    backgroundColor: "#FFFFFF",
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
  pageTitle: {
    flex: 1,
    textAlign: "center",
    marginRight: 50,
    fontSize: 17,
    color: "#263238",
    fontWeight: "700",
  },
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#F0F2F2",
  },
  moveId: {
    fontSize: 10,
    color: "#7580A0",
    letterSpacing: 0.8,
    fontWeight: "700",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleColumn: {
    flex: 1,
  },
  moveName: {
    fontSize: 29,
    lineHeight: 34,
    fontWeight: "800",
    color: "#263238",
  },
  moveFlavor: {
    fontSize: 12,
    color: "#77808B",
    marginTop: 2,
  },
  sunIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FDF6DE",
    alignItems: "center",
    justifyContent: "center",
  },
  sunCenter: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#4F9A6E",
  },
  sunRay: {
    position: "absolute",
    width: 2,
    height: 8,
    backgroundColor: "#4F9A6E",
    top: 7,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  primaryBadge: {
    height: 33,
    borderRadius: 9,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
  classBadge: {
    display: "none",
  },
  categoryBadge: {
    height: 33,
    borderRadius: 9,
    backgroundColor: "#EAF5F0",
    marginLeft: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    color: "#3D8059",
    fontSize: 17,
    marginRight: 7,
  },
  categoryText: {
    color: "#3D8059",
    fontSize: 12,
    fontWeight: "700",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 27,
  },
  statCard: {
    width: "31%",
    height: 91,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF1F1",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  statValue: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "800",
    color: "#263238",
  },
  statLabel: {
    fontSize: 11,
    color: "#767F88",
    marginTop: 7,
  },
  descriptionCard: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#263238",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 13,
    color: "#69737C",
    lineHeight: 19,
  },
  stepsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  stepCard: {
    width: "48%",
    height: 57,
    borderRadius: 10,
    backgroundColor: "#F8F9F9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  stepNumber: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: "#EAF5F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  stepNumberText: {
    color: "#3D8059",
    fontWeight: "800",
  },
  stepTitle: {
    color: "#263238",
    fontSize: 12,
    fontWeight: "800",
  },
  stepSubtitle: {
    color: "#7A838A",
    fontSize: 10,
  },
  stepArrow: {
    marginLeft: "auto",
    color: "#263238",
    fontSize: 21,
  },
  additionalTitle: {
    marginTop: 18,
    marginBottom: 8,
    color: "#7B848B",
    fontSize: 11,
  },
  additionalGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  additionalCard: {
    width: "48%",
    height: 57,
    borderRadius: 10,
    backgroundColor: "#F8F9F9",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  additionalLabel: {
    fontSize: 12,
    color: "#263238",
    fontWeight: "800",
  },
  additionalValue: {
    fontSize: 10,
    color: "#263238",
    marginTop: 2,
  },
  finalCard: {
    height: 58,
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: "#F8F9F9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  finalSun: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFF6DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  finalSunCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#C69529",
  },
  finalTitle: {
    color: "#263238",
    fontSize: 12,
    fontWeight: "800",
  },
  finalText: {
    color: "#77818A",
    fontSize: 10,
    marginTop: 3,
  },
});

export default MoveDetailsScreen;
