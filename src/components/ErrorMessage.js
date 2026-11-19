
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Componente ErrorMessage
 * Exibe uma mensagem de erro com botão para tentar novamente.
 *
 * @param {string} message - Mensagem de erro a ser exibida
 * @param {Function} onRetry - Callback para nova tentativa de carregamento
 */
const ErrorMessage = ({ message = 'Algo deu errado.', onRetry }) => (
  <View style={styles.container}>
    <Text style={styles.emoji}>⚠️</Text>
    <Text style={styles.message}>{message}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Tentar novamente</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8F9FA',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default ErrorMessage;
