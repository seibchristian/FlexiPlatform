# FlexiPlatform - Mobile App Interface Design

## Overview
FlexiPlatform ist eine erweiterbare Cross-Platform Plattform mit einem Plugin-System. Die App ermöglicht Benutzern, die Plattform durch Plugins zu erweitern und grundlegende Verwaltungsfunktionen durchzuführen.

## Design Principles
- **One-handed usage**: Alle interaktiven Elemente sind im unteren Drittel des Bildschirms erreichbar
- **Mobile portrait (9:16)**: Optimiert für vertikale Ausrichtung
- **iOS HIG compliant**: Folgt Apple Human Interface Guidelines für natives iOS-Gefühl
- **Minimal and clean**: Klare Hierarchie, keine überflüssigen Elemente

## Screen List

### 1. **Splash/Launch Screen**
- App-Logo und Name
- Automatischer Übergang zur Auth oder Home

### 2. **Login Screen**
- Email/Benutzername-Eingabefeld
- Passwort-Eingabefeld
- "Login"-Button
- "Registrieren"-Link
- Fehlerbehandlung

### 3. **Registration Screen**
- Name-Eingabefeld
- Email-Eingabefeld
- Passwort-Eingabefeld
- Passwort-Bestätigung
- "Registrieren"-Button
- "Zurück zum Login"-Link

### 4. **Home Screen (Dashboard)**
- Willkommensnachricht mit Benutzername
- Schnellzugriff-Karten:
  - Plugins verwalten
  - Benutzer verwalten
  - Einstellungen
  - Server-Status
- Aktuelle Aktivitäten/Benachrichtigungen

### 5. **Plugin Management Screen**
- Liste installierter Plugins
- Plugin-Details (Name, Version, Status)
- Buttons pro Plugin: Aktivieren/Deaktivieren, Einstellungen, Entfernen
- "Plugin hinzufügen"-Button
- Suchfunktion

### 6. **Plugin Detail Screen**
- Plugin-Name und Version
- Beschreibung
- Abhängigkeiten
- Konfigurationsoptionen
- Aktivieren/Deaktivieren Toggle
- Entfernen-Button

### 7. **User Management Screen**
- Liste aller Benutzer
- Benutzer-Info: Name, Email, Rolle
- Buttons: Bearbeiten, Löschen, Rechte verwalten
- "Neuer Benutzer"-Button
- Suchfunktion

### 8. **User Detail/Edit Screen**
- Benutzername
- Email
- Rolle (Dropdown: Admin, Editor, Viewer)
- Rechte-Checkboxen
- "Speichern"-Button
- "Abbrechen"-Button

### 9. **Printer Settings Screen**
- Liste konfigurierter Drucker
- Drucker-Status (Online/Offline)
- "Drucker hinzufügen"-Button
- Drucker-Details: Name, IP-Adresse, Modell
- Test-Druck-Button
- Entfernen-Button

### 10. **Server Settings Screen**
- Server-Status (Online/Offline)
- Server-Adresse
- Port-Konfiguration
- Logs anzeigen
- Restart-Button
- Backup-Optionen

### 11. **Database Settings Screen**
- Datenbank-Typ (MySQL, PostgreSQL, etc.)
- Verbindungsparameter (Host, Port, Benutzername)
- Datenbank-Name
- Test-Verbindung-Button
- Backup/Restore-Optionen
- Datenbank-Status

### 12. **Settings Screen**
- Allgemeine Einstellungen
- Sprache
- Theme (Light/Dark)
- Benachrichtigungen
- Datenschutz
- Über die App
- Logout-Button

## Primary Content and Functionality

### Home Screen
- **Content**: Willkommensnachricht, Schnellzugriff-Karten mit Icons
- **Functionality**: Navigation zu Plugins, Benutzer, Einstellungen, Server

### Plugin Management
- **Content**: Plugin-Liste mit Status-Indikatoren
- **Functionality**: Plugin aktivieren/deaktivieren, konfigurieren, entfernen, neue Plugins hinzufügen

### User Management
- **Content**: Benutzerliste mit Rollen und Rechten
- **Functionality**: Benutzer erstellen, bearbeiten, löschen, Rechte verwalten

### Settings
- **Content**: Drucker, Server, Datenbank, allgemeine Einstellungen
- **Functionality**: Konfiguration speichern, Verbindungen testen, Logs anzeigen

## Key User Flows

### Flow 1: Benutzer-Login
1. Benutzer öffnet App
2. Splash Screen wird angezeigt
3. Benutzer wird zu Login Screen weitergeleitet
4. Benutzer gibt Email und Passwort ein
5. Benutzer tippt "Login"
6. Bei Erfolg: Weiterleitung zu Home Screen
7. Bei Fehler: Fehlermeldung anzeigen

### Flow 2: Plugin installieren
1. Benutzer navigiert zu "Plugins verwalten"
2. Benutzer tippt "Plugin hinzufügen"
3. Plugin-Auswahl-Dialog wird angezeigt
4. Benutzer wählt Plugin aus
5. Plugin wird installiert und aktiviert
6. Bestätigung wird angezeigt
7. Benutzer wird zur Plugin-Liste zurückgeführt

### Flow 3: Benutzer erstellen
1. Benutzer navigiert zu "Benutzer verwalten"
2. Benutzer tippt "Neuer Benutzer"
3. Benutzer gibt Name, Email, Passwort ein
4. Benutzer wählt Rolle aus
5. Benutzer tippt "Erstellen"
6. Bestätigung wird angezeigt
7. Neuer Benutzer wird zur Liste hinzugefügt

### Flow 4: Drucker konfigurieren
1. Benutzer navigiert zu "Einstellungen" → "Drucker"
2. Benutzer tippt "Drucker hinzufügen"
3. Benutzer gibt Drucker-Details ein (Name, IP, Modell)
4. Benutzer tippt "Test-Druck"
5. Bei Erfolg: Drucker wird gespeichert
6. Bei Fehler: Fehlermeldung mit Lösungsvorschlag

## Color Choices

| Element | Color | Usage |
|---------|-------|-------|
| Primary | #0a7ea4 | Buttons, Links, Highlights |
| Background | #ffffff (Light) / #151718 (Dark) | Screen backgrounds |
| Surface | #f5f5f5 (Light) / #1e2022 (Dark) | Cards, elevated surfaces |
| Foreground | #11181C (Light) / #ECEDEE (Dark) | Primary text |
| Muted | #687076 (Light) / #9BA1A6 (Dark) | Secondary text |
| Border | #E5E7EB (Light) / #334155 (Dark) | Dividers, borders |
| Success | #22C55E | Success states, active status |
| Warning | #F59E0B | Warning messages |
| Error | #EF4444 | Error messages, delete actions |

## Navigation Structure

```
Home (Dashboard)
├── Plugins
│   ├── Plugin List
│   └── Plugin Detail
├── Users
│   ├── User List
│   └── User Detail/Edit
├── Settings
│   ├── Printer Settings
│   ├── Server Settings
│   ├── Database Settings
│   └── General Settings
└── Profile/Logout
```

## Responsive Considerations

- All content fits within safe area (no notch overlap)
- Tab bar at bottom for easy one-handed navigation
- Touch targets minimum 44x44pt
- Scrollable content for lists and forms
- Adaptive layouts for different screen sizes
