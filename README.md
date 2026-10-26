## Prerequisites

Make sure the following versions are installed:

- **Node.js:** `v22.23.3`
- **npm:** `10.9.9`

These are the development environment versions used for this project.

Check your installed versions:

```bash
node -v
npm -v
```

## Getting Started

1. Clone the repository or download the project.
2. Navigate to the project directory:

   ```bash
   cd travel-destination-explorer
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the Countries API credentials:


   - Create a `.env.local` file in the project root if it doesn't already exist.
   - Add the required environment variables and API credentials as expected by the project.
   - Refer to the project's environment configuration for the variable names.
   - Do not commit `.env.local` or expose API secrets in the repository.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL displayed in the terminal.

## Running Tests

Run all unit tests:

```bash
npm run test:unit -- --run
```

## Type Checking

```bash
npm run type-check
```

## Production Build

```bash
npm run build
```
