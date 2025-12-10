const API_BASE_URL = "http://165.1.120.191:3000/api/v1";

export const buildUrl = (imageId: string | number) =>
  `${API_BASE_URL}/document/${imageId}`;
