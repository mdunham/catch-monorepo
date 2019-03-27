// Capitalize does what it sounds like.
export function capitalize(value = '') {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}
