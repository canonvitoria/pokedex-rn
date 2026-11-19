 

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

/**
 * Componente LoadingSpinner
 * Exibe um spinner de carregamento centralizado na tela.
 *
 * @param {string} message - Mensagem opcional exibida abaixo do spinner
 */
const LoadingSpinner = ({ message = 'Carregando...' }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#EF4444" />
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
});

export default LoadingSpinner;
