/**
 * Recebe um timestamp e retorna uma string no formato DD/MM.
 */
export const formatDate = (timestamp: number): `${string}/${string}` => {
  const date = new Date(timestamp);
  return `${date.getUTCDate()}/${date.toISOString().slice(5, 7)}`;
};

/**
 * Recebe valor numérico de temperatura e retorna string em graus Celsius
 */
export const formatTemperature = (temperature: number): `${string} °C` => {
  return `${Math.round(temperature)} °C`;
};

/**
 * Recebe valor numérico de precipitação e retorna string com mm
 */
export const formatPrecipitation = (precipitation: number): `${string} mm` => {
  return `${Math.round} mm`;
};
