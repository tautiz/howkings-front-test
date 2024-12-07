# howkings-front-test

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/tautiz/howkings-front-test)

## Environment Setup

This project uses environment variables for configuration. Follow these steps to set up your environment:

1. Copy the `.env.example` file to create your own `.env` file:

   ```bash
   cp .env.example .env
   ```

2. Modify the `.env` file with your specific configuration values:
   - `VITE_API_URL`: API endpoint URL
   - `VITE_FEATURE_ALLOW_USER_REGISTRATION`: Enable user registration feature
   - `VITE_FEATURE_ENABLE_SEARCH`: Enable search feature

Note: When running `npm run dev`, the system will automatically check for the existence of the `.env` file and create one from `.env.example` if it doesn't exist.

1. Run the development server:

   ```bash
   npm run dev
   ```

2. Access the application at [http://localhost:5173](http://localhost:5173)

## Running Tests

To run tests, use the following command:
    ```bash
    npm run test
    ```
