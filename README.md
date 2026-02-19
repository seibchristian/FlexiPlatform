# FlexiPlatform

> Eine moderne, erweiterbare Cross-Platform Software-Plattform mit flexiblem Plugin-System

**FlexiPlatform** ist eine produktionsreife Plattform, die es Entwicklern und Administratoren ermöglicht, die Funktionalität durch ein modulares Plugin-System zu erweitern. Die Plattform läuft nativ auf iOS, Android und Web und bietet umfassende Verwaltungsfunktionen für Benutzer, Drucker, Server und Datenbanken.

## 🚀 Highlights

| Feature | Beschreibung |
|---------|-------------|
| **Plugin-System** | Modulare Architektur für einfache Erweiterbarkeit ohne Kern-Modifikationen |
| **Benutzerverwaltung** | Authentifizierung, Rollen und granulare Berechtigungen |
| **Cross-Platform** | iOS, Android und Web aus einer Codebasis |
| **Drucker-Verwaltung** | Netzwerk-Drucker konfigurieren und überwachen |
| **Server-Verwaltung** | Status-Überwachung und Konfiguration in Echtzeit |
| **Datenbank-Verwaltung** | Unterstützung für MySQL, PostgreSQL und SQLite |

---

## 📋 Inhaltsverzeichnis

- [Schnellstart](#-schnellstart)
- [Technologie-Stack](#-technologie-stack)
- [Installation](#-installation)
- [Verwendung](#-verwendung)
- [Plugin-System](#-plugin-system)
- [API-Dokumentation](#-api-dokumentation)
- [Projektstruktur](#-projektstruktur)
- [Konfiguration](#-konfiguration)
- [Entwicklung](#-entwicklung)
- [Troubleshooting](#-troubleshooting)
- [Beitragen](#-beitragen)
- [Lizenz](#-lizenz)

---

## 🎯 Schnellstart

### Voraussetzungen

Stellen Sie sicher, dass folgende Software installiert ist:

- **Node.js** 22.13 oder höher
- **pnpm** (Package Manager)
- **Git** (Versionskontrolle)

### Installation in 5 Minuten

```bash
# 1. Repository klonen
git clone https://github.com/seibchristian/FlexiPlatform.git
cd FlexiPlatform

# 2. Abhängigkeiten installieren
pnpm install

# 3. Datenbank-Migrationen durchführen
pnpm db:push

# 4. Entwicklungsserver starten
pnpm dev
```

Die Anwendung ist dann verfügbar unter:
- **Backend API**: http://localhost:3000
- **Frontend Web**: http://localhost:8081

---

## 🛠 Technologie-Stack

| Layer | Technologie | Version |
|-------|-------------|---------|
| **Frontend** | React Native + Expo | 54 |
| **Styling** | NativeWind (Tailwind CSS) | 4 |
| **Backend** | Express.js + Node.js | 22.13 |
| **API** | tRPC | 11.7.2 |
| **Datenbank** | Drizzle ORM + MySQL | Latest |
| **Authentifizierung** | Manus OAuth | - |
| **State Management** | React Context | - |

---

## 📥 Installation

### Detaillierte Installationsschritte

#### 1. Repository klonen

```bash
git clone https://github.com/seibchristian/FlexiPlatform.git
cd FlexiPlatform
```

#### 2. Abhängigkeiten installieren

```bash
pnpm install
```

#### 3. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env.local
```

Bearbeiten Sie `.env.local` mit Ihren Konfigurationen:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/flexiplatform

# Server
NODE_ENV=development
PORT=3000

# OAuth (optional)
OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret
OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/callback

# App
APP_NAME=FlexiPlatform
APP_VERSION=1.0.0
```

#### 4. Datenbank-Migrationen durchführen

```bash
pnpm db:push
```

#### 5. Entwicklungsserver starten

```bash
pnpm dev
```

Dies startet automatisch:
- Backend-Server auf Port 3000
- Metro Bundler auf Port 8081

---

## 💻 Verwendung

### Mobile App starten

**iOS Simulator:**
```bash
pnpm ios
```

**Android Emulator:**
```bash
pnpm android
```

**Web-Version:**
```bash
pnpm dev:metro
```

Die Web-Version ist dann unter `http://localhost:8081` erreichbar.

### Auf echtem Gerät testen

Generieren Sie einen QR-Code für Expo Go:

```bash
pnpm qr
```

Scannen Sie den QR-Code mit der **Expo Go**-App auf Ihrem Smartphone (iOS oder Android).

---

## 🔌 Plugin-System

Das Plugin-System ist das Herzstück von FlexiPlatform und ermöglicht es, neue Funktionen zur Laufzeit zu laden und zu entladen.

### Plugin-Architektur

Die Plugin-Architektur besteht aus vier Hauptkomponenten:

**Plugin Registry**: Verwaltet alle installierten Plugins und deren Metadaten in der Datenbank.

**Plugin Loader**: Lädt Plugins dynamisch zur Laufzeit und initialisiert sie mit der gespeicherten Konfiguration.

**Plugin Lifecycle Manager**: Verwaltet die Aktivierung, Deaktivierung und Konfiguration von Plugins während der Laufzeit.

**Plugin API**: Bietet eine standardisierte Schnittstelle für Plugins zur Interaktion mit der Plattform und anderen Plugins.

### Einfaches Plugin-Beispiel

```typescript
// plugins/my-plugin/src/index.ts
export interface MyPluginConfig {
  enabled: boolean;
  apiKey?: string;
}

export const myPlugin = {
  name: "My Custom Plugin",
  version: "1.0.0",
  description: "Ein benutzerdefiniertes Plugin für FlexiPlatform",
  author: "Your Name",
  
  async initialize(config: MyPluginConfig) {
    console.log("Plugin initialisiert mit Config:", config);
  },
  
  async execute(action: string, params: any) {
    switch (action) {
      case "doSomething":
        return { success: true, message: "Action ausgeführt" };
      default:
        throw new Error(`Unbekannte Action: ${action}`);
    }
  },
  
  async shutdown() {
    console.log("Plugin wird heruntergefahren");
  },
};
```

### Plugin installieren und verwalten

**Über die Benutzeroberfläche:**

1. Öffnen Sie die App und navigieren Sie zur "Plugins"-Seite
2. Klicken Sie auf "+ Hinzufügen"
3. Wählen Sie das Plugin aus der verfügbaren Liste
4. Das Plugin wird installiert und kann sofort aktiviert werden

**Plugin konfigurieren:**

1. Gehen Sie zur Plugin-Detail-Seite
2. Bearbeiten Sie die Konfigurationsparameter
3. Speichern Sie die Änderungen
4. Das Plugin wird mit den neuen Einstellungen neu geladen

### Sample Analytics Plugin

Ein vollständiges Sample-Plugin ist im Verzeichnis `plugins/sample-analytics-plugin/` enthalten. Dieses Plugin demonstriert Best Practices für die Plugin-Entwicklung:

- Vollständige TypeScript-Implementierung
- Lifecycle-Management
- Fehlerbehandlung und Logging
- Unit Tests
- Konfigurationsvalidierung

Siehe `PLUGIN_GUIDE.md` für eine ausführliche Entwicklungsanleitung.

---

## 📡 API-Dokumentation

### Authentifizierung

Alle geschützten Endpoints erfordern Authentifizierung über Manus OAuth.

**Login:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Plugin-Endpoints

| Endpoint | Methode | Beschreibung |
|----------|---------|-------------|
| `/api/trpc/plugins.list` | GET | Alle Plugins auflisten |
| `/api/trpc/plugins.create` | POST | Neues Plugin erstellen |
| `/api/trpc/plugins.update` | PUT | Plugin aktualisieren |
| `/api/trpc/plugins.toggle` | POST | Plugin aktivieren/deaktivieren |
| `/api/trpc/plugins.delete` | DELETE | Plugin löschen |

**Plugins auflisten:**
```bash
GET /api/trpc/plugins.list
Authorization: Bearer {token}
```

**Plugin erstellen:**
```bash
POST /api/trpc/plugins.create
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "Plugin description",
  "author": "Author Name",
  "config": {}
}
```

### Drucker-Endpoints

| Endpoint | Methode | Beschreibung |
|----------|---------|-------------|
| `/api/trpc/printers.list` | GET | Alle Drucker auflisten |
| `/api/trpc/printers.create` | POST | Neuen Drucker hinzufügen |
| `/api/trpc/printers.update` | PUT | Drucker aktualisieren |
| `/api/trpc/printers.delete` | DELETE | Drucker löschen |

**Drucker hinzufügen:**
```bash
POST /api/trpc/printers.create
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Office Printer",
  "ipAddress": "192.168.1.100",
  "port": 9100,
  "model": "HP LaserJet Pro"
}
```

### Benutzer-Endpoints

| Endpoint | Methode | Beschreibung |
|----------|---------|-------------|
| `/api/trpc/users.list` | GET | Alle Benutzer auflisten |
| `/api/trpc/users.create` | POST | Neuen Benutzer erstellen |
| `/api/trpc/users.update` | PUT | Benutzer aktualisieren |
| `/api/trpc/users.delete` | DELETE | Benutzer löschen |

**Benutzer erstellen:**
```bash
POST /api/trpc/users.create
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "securepassword",
  "role": "editor"
}
```

---

## 📁 Projektstruktur

```
FlexiPlatform/
├── app/                          # Expo Router Screens (Frontend)
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab Navigation
│   │   └── index.tsx            # Home/Dashboard Screen
│   ├── plugins.tsx              # Plugin Management Screen
│   ├── users.tsx                # User Management Screen
│   └── settings/
│       ├── index.tsx            # General Settings
│       ├── printers.tsx         # Printer Settings
│       ├── server.tsx           # Server Settings
│       └── database.tsx         # Database Settings
│
├── components/                   # Reusable React Components
│   ├── screen-container.tsx     # SafeArea Wrapper
│   └── ui/
│       └── icon-symbol.tsx      # Icon Mapping
│
├── hooks/                        # Custom React Hooks
│   ├── use-auth.ts              # Authentication Hook
│   ├── use-colors.ts            # Theme Colors Hook
│   └── use-color-scheme.ts      # Dark/Light Mode Detection
│
├── lib/                          # Utilities & Configuration
│   ├── trpc.ts                  # tRPC Client
│   └── utils.ts                 # Helper Functions
│
├── server/                       # Backend API (Node.js/Express)
│   ├── routers.ts               # tRPC Routes Definition
│   ├── db.ts                    # Database Query Functions
│   └── _core/                   # Framework Core Code
│
├── drizzle/                      # Database Schema (ORM)
│   ├── schema.ts                # Table Definitions
│   └── migrations/              # Database Migrations
│
├── shared/                       # Shared Code
│   ├── types.ts                 # TypeScript Type Definitions
│   └── const.ts                 # Constants
│
├── assets/                       # Static Assets
│   └── images/                  # App Icons & Logos
│
├── plugins/                      # Plugin Directory
│   └── sample-analytics-plugin/ # Sample Plugin Template
│
├── app.config.ts                # Expo Configuration
├── tailwind.config.js           # Tailwind CSS Configuration
├── theme.config.js              # Theme Colors Definition
├── package.json                 # Project Dependencies
├── tsconfig.json                # TypeScript Configuration
├── PLUGIN_GUIDE.md              # Plugin Development Guide
└── README.md                    # This File
```

---

## ⚙️ Konfiguration

### Theme-Anpassung

Passen Sie die Farben in `theme.config.js` an:

```javascript
const themeColors = {
  primary: { light: '#0a7ea4', dark: '#0a7ea4' },
  background: { light: '#ffffff', dark: '#151718' },
  surface: { light: '#f5f5f5', dark: '#1e2022' },
  foreground: { light: '#11181C', dark: '#ECEDEE' },
  muted: { light: '#687076', dark: '#9BA1A6' },
  border: { light: '#E5E7EB', dark: '#334155' },
  success: { light: '#22C55E', dark: '#4ADE80' },
  warning: { light: '#F59E0B', dark: '#FBBF24' },
  error: { light: '#EF4444', dark: '#F87171' },
};
```

### App-Metadaten

Bearbeiten Sie `app.config.ts` um App-Namen und andere Metadaten anzupassen:

```typescript
const env = {
  appName: "FlexiPlatform",
  appSlug: "flexiplatform",
  logoUrl: "https://...",
  scheme: "manus...",
  iosBundleId: "space.manus.flexiplatform",
  androidPackage: "space.manus.flexiplatform",
};
```

---

## 🔧 Entwicklung

### Neue Features hinzufügen

**Workflow für neue Features:**

1. **Backend-Endpoint erstellen**: Fügen Sie einen neuen Router in `server/routers.ts` hinzu
2. **Datenbank-Schema aktualisieren**: Modifizieren Sie `drizzle/schema.ts` wenn nötig
3. **Migrationen durchführen**: Führen Sie `pnpm db:push` aus
4. **Frontend-Screen erstellen**: Erstellen Sie einen neuen Screen in `app/`
5. **API-Integration**: Verwenden Sie tRPC Hooks im Frontend

### Testing

```bash
# Unit Tests ausführen
pnpm test

# Tests im Watch-Modus
pnpm test:watch

# TypeScript Typ-Checking
pnpm check

# Linting
pnpm lint

# Code formatieren
pnpm format
```

### Build für Production

```bash
# Backend bauen
pnpm build

# Production starten
pnpm start
```

---

## 🐛 Troubleshooting

### Datenbank-Verbindungsfehler

**Problem**: "Cannot connect to database"

**Lösung**: Überprüfen Sie, dass die `DATABASE_URL` in `.env.local` korrekt ist und der Datenbankserver läuft.

```bash
# Datenbankverbindung testen
mysql -u user -p -h localhost flexiplatform
```

### Plugin lädt nicht

**Problem**: Plugin wird nicht in der UI angezeigt

**Lösung**: Überprüfen Sie die Plugin-Konfiguration und stellen Sie sicher, dass alle erforderlichen Abhängigkeiten installiert sind.

```bash
# Plugin-Verzeichnis überprüfen
ls -la plugins/your-plugin/
```

### Metro Bundler Fehler

**Problem**: "Metro bundler error" oder "Cannot find module"

**Lösung**: Löschen Sie den Cache und starten Sie neu:

```bash
rm -rf node_modules/.cache
pnpm install
pnpm dev
```

### TypeScript Fehler

**Problem**: "Type errors in compilation"

**Lösung**: Führen Sie `pnpm check` aus um alle Typ-Fehler zu identifizieren:

```bash
pnpm check
```

---

## 🤝 Beitragen

Wir freuen uns über Beiträge! Bitte beachten Sie folgende Richtlinien:

1. **Forken Sie das Repository**
2. **Erstellen Sie einen Feature-Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Committen Sie Ihre Änderungen**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Pushen Sie zum Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Öffnen Sie einen Pull Request**

---

## 📄 Lizenz

Dieses Projekt ist unter der **MIT-Lizenz** lizenziert. Siehe `LICENSE` Datei für Details.

---

## 📞 Support

Bei Fragen oder Problemen:

- **Issues**: Erstellen Sie ein Issue im [GitHub-Repository](https://github.com/seibchristian/FlexiPlatform/issues)
- **Dokumentation**: Lesen Sie `PLUGIN_GUIDE.md` für Plugin-Entwicklung
- **Diskussionen**: Nutzen Sie [GitHub Discussions](https://github.com/seibchristian/FlexiPlatform/discussions)

---

## 🗺️ Roadmap

- [ ] Erweiterte Plugin-Verwaltung mit Marketplace
- [ ] WebSocket-Unterstützung für Echtzeit-Updates
- [ ] Mobile App für iOS und Android App Store
- [ ] Erweiterte Benutzer-Berechtigungen und Rollen
- [ ] API-Rate-Limiting und erweiterte Sicherheit
- [ ] Internationalisierung (i18n) für mehrere Sprachen
- [ ] Vollständiger Dark Mode Support
- [ ] Offline-Modus für Mobile-Geräte
- [ ] Plugin-Marketplace mit Community-Plugins
- [ ] Erweiterte Monitoring und Analytics

---

## 📚 Weitere Ressourcen

- **Plugin Development Guide**: Siehe `PLUGIN_GUIDE.md`
- **Sample Plugin**: Siehe `plugins/sample-analytics-plugin/`
- **Design Dokumentation**: Siehe `design.md`
- **GitHub Repository**: https://github.com/seibchristian/FlexiPlatform

---

**Entwickelt mit ❤️ von Manus AI**

Letztes Update: Februar 2026 | Version: 1.0.0
