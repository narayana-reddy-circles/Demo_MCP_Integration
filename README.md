# Demo React App

A basic React application created with Vite for fast development and modern tooling.

## Features

- Interactive counter component
- Modern React hooks (useState)
- Clean, responsive UI design
- Hot module replacement for development
- ES modules support

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine (version 16 or higher recommended).

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

### Development

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

### Building for Production

4. Build the app for production:
   ```bash
   npm run build
   ```

5. Preview the production build:
   ```bash
   npm run preview
   ```

## Project Structure

```
Demo_MCP_Integration/
├── public/
├── src/
│   ├── App.js          # Main App component
│   ├── App.css         # App-specific styles
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── README.md           # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm start` - Alternative to `npm run dev`

## Technologies Used

- **React 18** - JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **ES Modules** - Modern JavaScript module system

## Next Steps

- Add more components to build out your application
- Install additional dependencies as needed
- Customize the styling to match your design
- Add routing with React Router if needed
- Implement state management with Context API or external libraries
