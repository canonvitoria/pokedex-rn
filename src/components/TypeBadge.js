
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getTypeColor } from '../constants/typeColors';

/**
 * Componente TypeBadge
 * Renderiza um badge colorido com o nome do tipo do Pokémon.
 *
 * @param {string} type - Nome do tipo (ex: 'fire', 'grass')
 * @param {string} size - Tamanho do badge: 'sm' | 'md' | 'lg'
 */
const TypeBadge = ({ type, size = 'md' }) => {
  const isLarge = size === 'lg';
  const isMedium = size === 'md';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: getTypeColor(type) },
        isLarge && styles.badgeLg,
        isMedium && styles.badgeMd,
      ]}
    >
      <Text
        style={[
          styles.text,
          isLarge && styles.textLg,
        ]}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    margin: 3,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeLg: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  textLg: {
    fontSize: 15,
  },
});

export default TypeBadge;
