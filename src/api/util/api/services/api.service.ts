const apiHeaders = {
  'Content-Type': 'application/json',
};

export const apiService = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(url);

    return (await response.json()) as T;
  },

  post: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: apiHeaders,
    });

    return response.json();
  },

  put: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: apiHeaders,
    });

    return response.json();
  },
};
