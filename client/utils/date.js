export const formatDate = date =>
  ('0' + (date.getUTCMonth() + 1)).slice(-2) + '/' +
  ('0' + date.getUTCDate()).slice(-2) + '/' +
  ('0' + date.getUTCFullYear()).slice(-2);
