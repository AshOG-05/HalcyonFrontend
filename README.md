HalcyonFrontend

HalcyonFrontend is a modern, minimalistic frontend template built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/). It offers a streamlined setup featuring Hot Module Replacement (HMR), ESLint integration, and a clean project structure, making it ideal for rapid development and scalability.

🚀 Features

* ⚛️ React 18: Leverages the latest features of React for building dynamic user interfaces.
* ⚡ Vite: Utilizes Vite for lightning-fast development and optimized production builds.
* ♻️ Hot Module Replacement (HMR): Enables real-time updates during development without full page reloads.
* 🧹 ESLint Integration: Ensures code quality and consistency with customizable linting rules.
* 🗂️ Modular Structure: Organized project architecture for maintainability and scalability.

📁 Project Structure

```
HalcyonFrontend/
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
├── .gitignore          # Git ignore rules
├── eslint.config.js    # ESLint configuration
├── index.html          # HTML template
├── package.json        # Project metadata and dependencies
├── vite.config.js      # Vite configuration
└── README.md           # Project documentation
```

🛠️ Getting Started

Prerequisites

* [Node.js](https://nodejs.org/) (v14 or higher)
* [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AshOG-05/HalcyonFrontend.git
   cd HalcyonFrontend
   ```

2. Install dependencies:

   Using npm:

   ```bash
   npm install
   ```

   Or using Yarn:

   ```bash
   yarn install
   ```

3. Start the development server:

   Using npm:

   ```bash
   npm run dev
   ```

   Or using Yarn:

   ```bash
   yarn dev
   ```

   The application will be available at `http://localhost:5173/` by default.

🧪 Scripts

* `dev`: Starts the development server with HMR.
* `build`: Builds the application for production.
* `preview`: Serves the production build locally.
* `lint`: Runs ESLint to analyze code quality.

🔧 ESLint Configuration

The project includes a basic ESLint setup to maintain code quality. For enhanced linting, especially in TypeScript projects, consider integrating `typescript-eslint`. Refer to the [TypeScript ESLint documentation](https://typescript-eslint.io/) for guidance.

📦 Dependencies

Key dependencies include:

* `react`
* `react-dom`
* `vite`
* `@vitejs/plugin-react`

For a complete list, refer to the `package.json` file.

📄 License

This project is licensed under the [MIT License](LICENSE).

The backend for this project is : https://github.com/Abhi9835004352/HalcyonBackend

