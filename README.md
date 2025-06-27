# Tucarga App

Tucarga App is a comprehensive vehicle management web application built with React, TypeScript, and Tailwind CSS. The application allows users to manage their vehicles and related documentation such as SOAT (insurance), technical inspections, and other vehicle-related items.

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom fonts (Bomstad Display)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: React Icons, Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM v6

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (version 7 or higher)
- **Backend API** running on `http://localhost:4000`

## Backend Requirements

⚠️ **Important**: This application requires a backend API to be running on `http://localhost:4000/api`. The frontend expects the following endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/users` - User registration
- `POST /api/verification/send-code` - Email verification
- `POST /api/verification/verify` - Code verification
- Vehicle and vehicle items management endpoints

Make sure your backend API is running before starting the frontend application.

## Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone [repository-url]
   cd tucarga-app
   ```

2. **Install dependencies**:

   ```bash
   npm install --legacy-peer-deps
   ```

   > **Note**: The `--legacy-peer-deps` flag is required due to peer dependency conflicts with some packages.

3. **Start the development server**:

   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run test` - Launches the test runner
- `npm run lint` - Runs ESLint to check for code issues
- `npm run format` - Formats code using Prettier
- `npm run lint-format` - Runs both linting and formatting

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (Button, Header, Layout)
│   ├── dashboard/       # Dashboard-specific components
│   └── modals/          # Modal components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API service functions
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and constants
└── assets/              # Static assets (images, icons, fonts)
```

## Key Features

- **User Authentication**: Login, registration, and email verification
- **Vehicle Management**: Add, view, and manage vehicles
- **Document Management**: SOAT, technical inspections, and other vehicle documents
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Context-based State Management**: Efficient state sharing across components

## API Configuration

The application is configured to connect to a backend API at `http://localhost:4000/api`. If you need to change this URL, update the `baseURL` in `src/services/api.ts`:

```typescript
const apiClient = axios.create({
  baseURL: "http://localhost:4000/api", // Change this URL if needed
  headers: {
    "Content-Type": "application/json",
  },
});
```

## Environment Variables

Currently, the application doesn't use environment variables, but you may want to add them for different environments. Create a `.env` file in the root directory for environment-specific configurations.

## Troubleshooting

### Common Issues

1. **Dependency Installation Errors**: Use `npm install --legacy-peer-deps` to resolve peer dependency conflicts.

2. **API Connection Issues**: Ensure your backend API is running on `http://localhost:4000` and all required endpoints are available.

3. **Font Loading Issues**: Custom fonts are included in the `public/fonts/` directory. Ensure these files are properly served.

4. **Build Errors**: Check that all TypeScript types are properly defined and imported.

## Development Guidelines

- Follow the existing code structure and naming conventions
- Use TypeScript for type safety
- Implement proper error handling for API calls
- Use the existing context providers for state management
- Follow responsive design principles with Tailwind CSS

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
