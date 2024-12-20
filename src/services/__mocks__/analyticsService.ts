export const analyticsService = {
  initializeAnalytics: jest.fn(),
  trackFormInteraction: jest.fn(),
  setUserProperties: jest.fn(),
  trackEvent: jest.fn(),
  isInitialized: jest.fn().mockReturnValue(true)
};
