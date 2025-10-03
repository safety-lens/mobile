# Safety Lens Mobile App 🔍

A React Native mobile application built with Expo for workplace safety observation and hazard detection. The app helps users identify safety hazards, document observations, and maintain OSHA compliance through AI-powered image analysis.

## 📱 Features

- **Hazard Detection**: AI-powered image analysis for workplace safety
- **Safety Observations**: Document and track safety incidents
- **OSHA Compliance**: Generate compliance reports and recommendations
- **Multi-language Support**: Internationalization with i18next
- **Cross-platform**: iOS, Android

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) installed globally
- For iOS development: [Xcode](https://developer.apple.com/xcode/) (macOS only)
- For Android development: [Android Studio](https://developer.android.com/studio)

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd safety-lens
   ```

2. **Install dependencies**

   ```bash
   yarn
   ```

3. **Start the development server**
   ```bash
   yarn start
   # or
   npx expo start
   ```

## 🔧 Environment Configuration

### Environment Variables

The app uses environment variables to configure different environments. Set the following variable:

| Variable              | Description             | Values                  |
| --------------------- | ----------------------- | ----------------------- |
| `EXPO_PUBLIC_APP_ENV` | Application environment | `staging`, `production` |

### API Configuration

The app automatically configures API endpoints based on the environment:

- **Production**: `https://api.safetylens.ai/`
- **Staging**: `https://api-staging.safetylens.ai/`

Environment is determined by the `EXPO_PUBLIC_APP_ENV` variable and configured in `src/constants/api.ts`.

## 🛠️ Development

### Available Scripts

| Script                          | Description                                 |
| ------------------------------- | ------------------------------------------- |
| `yarn start`                    | Start Expo development server               |
| `yarn android`                  | Run on Android device/emulator              |
| `yarn ios`                      | Run on iOS device/simulator                 |
| `yarn test`                     | Run Jest tests in watch mode                |
| `yarn lint`                     | Run ESLint                                  |
| `yarn release`                  | Bump release version and generate changelog |
| `yarn build:ios:staging`        | Build iOS app for staging                   |
| `yarn build:android:staging`    | Build Android app for staging               |
| `yarn build:ios:production`     | Build iOS app for production                |
| `yarn build:android:production` | Build Android app for production            |

### Development Workflow

1. **Start the development server**

   ```bash
   yarn start
   ```

2. **File Structure**
   - `app/` - Main application screens using Expo Router
   - `src/` - Source code (components, utilities, services)
   - `assets/` - Static assets (images, fonts, animations)

## Versioning & Changelog

### Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to maintain a clear commit history and generate automatic changelogs. Format: `<type>[scope]: <description>`

**Common types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Examples:**

```bash
feat(auth): add biometric authentication
fix(camera): resolve image capture on Android
docs: update README with deployment instructions
chore(deps): update expo to version 53
```

**Recommended Tool:** Use [Commitizen](https://github.com/commitizen/cz-cli) for interactive commit creation:

```bash
npm install -g commitizen cz-conventional-changelog
git add . && cz
```

📖 **Learn More:**

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Commitizen Documentation](https://github.com/commitizen/cz-cli)
- [Standard Version Guide](https://github.com/conventional-changelog/standard-version)

### Creating Releases

To create a new release with automatic changelog generation:

```bash
yarn release
git push --follow-tags
```

This command will:

1. Analyze conventional commits since the last release
2. Determine the next version number (following semantic versioning)
3. Generate/update CHANGELOG.md
4. Create a git tag
5. Commit the changes

The release process uses [standard-version](https://github.com/conventional-changelog/standard-version) which follows semantic versioning:

- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

## Building for Production

### EAS Build

1. **Install EAS CLI**

   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**

   ```bash
   eas login
   ```

3. **Build for Staging**

   ```bash
   # iOS Staging
   yarn build:ios:staging
   # or
   eas build --platform ios --profile staging

   # Android Staging
   yarn build:android:staging
   # or
   eas build --platform android --profile staging
   ```

4. **Build for Production**

   ```bash
   # iOS Production
   yarn build:ios:production
   # or
   eas build --platform ios --profile production

   # Android Production
   yarn build:android:production
   # or
   eas build --platform android --profile production
   ```

### Local Builds

For local builds (useful for testing):

```bash
# Android Local Build
eas build --platform android --local

# iOS Local Build (macOS only)
eas build --platform ios --local
```

### Build Profiles

The app uses different build profiles configured in `eas.json`:

- **development**: Development client with staging environment
- **preview**: Internal distribution with APK format
- **staging**: Store distribution for staging environment
- **production**: Store distribution for production environment

## 🔐 App Signing

### Android

- **Debug**: Managed by Expo
- **Release**: Configure your production keystore in EAS

### iOS

- Managed by EAS Build and Apple Developer Account

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [EAS Build](https://docs.expo.dev/build/setup/)
