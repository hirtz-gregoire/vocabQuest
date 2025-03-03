// API service for interacting with the backend

// Base URL for the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// API endpoints
export const API_ENDPOINTS = {
  THEMES: `${API_BASE_URL}/themes`,
  THEME: (id: string) => `${API_BASE_URL}/themes/${id}`,
};

// API service functions
export const apiService = {
  // Get all themes
  getAllThemes: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.THEMES);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching themes:', error);
      throw error;
    }
  },

  // Get a theme by ID
  getThemeById: async (id: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.THEME(id));
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching theme with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new theme
  createTheme: async (userRequest: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.THEMES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userRequest),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating theme:', error);
      throw error;
    }
  },
};
