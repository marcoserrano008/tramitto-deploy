const API_BASE_URL = "https://test-app-ms.duckdns.org/api/v1";

export const buildUrl = (imageId: string | number) =>
  `${API_BASE_URL}/document/${imageId}`;
