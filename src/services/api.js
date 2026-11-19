import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * Busca a lista de Pokémons com suporte a paginação.
 * @param {number} limit - Quantidade de Pokémons por página
 * @param {number} offset - Deslocamento para paginação
 * @returns {Promise<Object>} Objeto com count, next, previous e results
 */
export const fetchPokemonList = async (limit = 100, offset = 0) => {
  const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
};

/**
 * Busca os detalhes completos de um Pokémon pelo ID ou nome.
 * @param {string|number} idOrName - ID numérico ou nome do Pokémon
 * @returns {Promise<Object>} Dados completos do Pokémon
 */
export const fetchPokemonDetails = async (idOrName) => {
  const response = await api.get(`/pokemon/${idOrName}`);
  return response.data;
};

/**
 * Busca os detalhes de um movimento pelo ID.
 * @param {string|number} idOrUrl - ID numérico ou URL completa do movimento
 * @returns {Promise<Object>} Dados completos do movimento
 */
export const fetchMoveDetails = async (idOrUrl) => {
  if (typeof idOrUrl === 'string' && idOrUrl.startsWith('http')) {
    const response = await axios.get(idOrUrl);
    return response.data;
  }
  const response = await api.get(`/move/${idOrUrl}`);
  return response.data;
};
