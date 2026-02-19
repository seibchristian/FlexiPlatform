# FlexiPlatform Installation Guide

> Schritt-für-Schritt Anleitung für die Installation auf Windows, Linux und macOS

**Version**: 1.0.0  
**Letztes Update**: Februar 2026  
**Autor**: Manus AI

## Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Windows Installation](#windows-installation)
3. [Linux Installation](#linux-installation)
4. [macOS Installation](#macos-installation)
5. [Datenbank-Konfiguration](#datenbank-konfiguration)
6. [Produktivbetrieb](#produktivbetrieb)
7. [Troubleshooting](#troubleshooting)
8. [Häufig gestellte Fragen](#häufig-gestellte-fragen)

---

## Überblick

FlexiPlatform ist eine Cross-Platform Anwendung, die auf Windows, Linux und macOS läuft. Dieser Guide erklärt die Installation auf jedem Betriebssystem detailliert.

### Systemanforderungen (alle Plattformen)

| Komponente | Anforderung | Empfehlung |
|-----------|-----------|-----------|
| **RAM** | 2 GB minimum | 4 GB oder mehr |
| **Festplatte** | 5 GB freier Speicher | 20 GB freier Speicher |
| **CPU** | Dual-Core | Quad-Core oder besser |
| **Node.js** | 22.13 oder höher | Latest LTS |
| **MySQL** | 8.0 oder höher | 8.0.x oder 8.1.x |
| **Netzwerk** | Internetverbindung | Stabile Verbindung |

### Installationsdauer

Die Installationsdauer variiert je nach Betriebssystem und Internetgeschwindigkeit:

- **Windows**: 20-30 Minuten
- **Linux**: 15-25 Minuten
- **macOS**: 15-25 Minuten

---

## Windows Installation

### Schritt 1: Voraussetzungen installieren

#### Node.js installieren

1. Besuchen Sie https://nodejs.org/
2. Laden Sie die **LTS-Version** (22.13 oder höher) herunter
3. Führen Sie das Installationsprogramm aus
4. Akzeptieren Sie die Lizenzbedingungen
5. Wählen Sie den Standard-Installationspfad
6. Aktivieren Sie "Add to PATH" (wichtig!)
7. Klicken Sie auf "Install"

Überprüfen Sie die Installation in PowerShell:

```powershell
node --version
npm --version
```

#### pnpm installieren

Öffnen Sie PowerShell als Administrator und führen Sie aus:

```powershell
npm install -g pnpm
pnpm --version
```

#### Git installieren

1. Besuchen Sie https://git-scm.com/
2. Laden Sie das Windows-Installationsprogramm herunter
3. Führen Sie das Installationsprogramm aus
4. Wählen Sie "Use Git from the Windows Command Prompt"
5. Wählen Sie "Checkout Windows-style, commit Unix-style line endings"
6. Klicken Sie auf "Install"

Überprüfen Sie die Installation:

```powershell
git --version
```

#### MySQL installieren

1. Besuchen Sie https://dev.mysql.com/downloads/mysql/
2. Laden Sie **MySQL 8.0 Community Server** herunter
3. Führen Sie das Installationsprogramm aus
4. Wählen Sie "Server only" oder "Full" Installation
5. Klicken Sie auf "Next" bis zur MySQL Server Configuration
6. Wählen Sie "Standalone MySQL Server / Classic MySQL Server"
7. Konfigurieren Sie die Verbindungseinstellungen:
   - **Port**: 3306 (Standard)
   - **Config Type**: Development Machine
8. Wählen Sie "Configure MySQL Server as a Windows Service"
9. Setzen Sie ein starkes Passwort für den root-Benutzer
10. Klicken Sie auf "Execute" und dann "Finish"

Überprüfen Sie die Installation in PowerShell:

```powershell
mysql --version
```

### Schritt 2: Repository klonen

Öffnen Sie PowerShell und navigieren Sie zu einem Verzeichnis Ihrer Wahl:

```powershell
# Navigieren Sie zu einem geeigneten Verzeichnis
cd C:\Users\YourUsername\Documents

# Repository klonen
git clone https://github.com/seibchristian/FlexiPlatform.git
cd FlexiPlatform
```

### Schritt 3: Abhängigkeiten installieren

```powershell
pnpm install
```

Dies kann 5-10 Minuten dauern, je nach Internetgeschwindigkeit.

### Schritt 4: Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env.local` Datei im Projektroot:

```powershell
# Mit Notepad erstellen
notepad .env.local
```

Fügen Sie folgende Inhalte ein:

```env
# Database Configuration
DATABASE_URL=mysql://root:your_password@localhost:3306/flexiplatform
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=flexiplatform

# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# App Configuration
APP_NAME=FlexiPlatform
APP_VERSION=1.0.0
APP_ENVIRONMENT=development

# OAuth (optional)
OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret
OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

Ersetzen Sie `your_password` mit einem starken Passwort.

### Schritt 5: Datenbank einrichten

Öffnen Sie PowerShell und verbinden Sie sich mit MySQL:

```powershell
mysql -u root -p
```

Geben Sie Ihr MySQL-Passwort ein. Führen Sie dann folgende Befehle aus:

```sql
-- Datenbank erstellen
CREATE DATABASE flexiplatform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Benutzer erstellen
CREATE USER 'flexiplatform'@'localhost' IDENTIFIED BY 'your_password';

-- Berechtigungen erteilen
GRANT ALL PRIVILEGES ON flexiplatform.* TO 'flexiplatform'@'localhost';
FLUSH PRIVILEGES;

-- Beenden
EXIT;
```

Führen Sie die Datenbank-Migrationen durch:

```powershell
pnpm db:push
```

### Schritt 6: Entwicklungsserver starten

```powershell
pnpm dev
```

Die Anwendung ist dann verfügbar unter:
- **Backend API**: http://localhost:3000
- **Frontend Web**: http://localhost:8081

### Schritt 7: Auf echtem Gerät testen (optional)

Für Tests auf einem echten Gerät generieren Sie einen QR-Code:

```powershell
pnpm qr
```

Scannen Sie den QR-Code mit der Expo Go App auf Ihrem Smartphone.

---

## Linux Installation

### Ubuntu/Debian Installation

#### Schritt 1: Systemaktualisierung

Öffnen Sie ein Terminal und führen Sie aus:

```bash
sudo apt update
sudo apt upgrade -y
```

#### Schritt 2: Voraussetzungen installieren

**Node.js und npm installieren:**

```bash
# NodeSource Repository hinzufügen
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Node.js installieren
sudo apt install -y nodejs

# Überprüfung
node --version
npm --version
```

**pnpm installieren:**

```bash
npm install -g pnpm
pnpm --version
```

**Git installieren:**

```bash
sudo apt install -y git
git --version
```

**MySQL installieren:**

```bash
# MySQL Server installieren
sudo apt install -y mysql-server

# MySQL Sicherheitsskript ausführen
sudo mysql_secure_installation
```

Folgen Sie den Anweisungen:
- Setzen Sie ein Passwort für root
- Entfernen Sie anonyme Benutzer
- Deaktivieren Sie Remote-Root-Login
- Entfernen Sie Test-Datenbanken

**Build-Tools installieren:**

```bash
sudo apt install -y build-essential python3
```

#### Schritt 3: Repository klonen

```bash
# Navigieren Sie zu einem geeigneten Verzeichnis
cd ~/projects

# Repository klonen
git clone https://github.com/seibchristian/FlexiPlatform.git
cd FlexiPlatform
```

#### Schritt 4: Abhängigkeiten installieren

```bash
pnpm install
```

#### Schritt 5: Umgebungsvariablen konfigurieren

```bash
# .env.local Datei erstellen
cat > .env.local << 'EOF'
# Database Configuration
DATABASE_URL=mysql://flexiplatform:your_password@localhost:3306/flexiplatform
DB_HOST=localhost
DB_PORT=3306
DB_USER=flexiplatform
DB_PASSWORD=your_password
DB_NAME=flexiplatform

# Server Configuration
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# App Configuration
APP_NAME=FlexiPlatform
APP_VERSION=1.0.0
APP_ENVIRONMENT=development
EOF
```

Bearbeiten Sie die Datei mit Ihren Einstellungen:

```bash
nano .env.local
```

#### Schritt 6: Datenbank einrichten

```bash
# Mit MySQL verbinden
sudo mysql -u root -p
```

Führen Sie folgende Befehle aus:

```sql
-- Datenbank erstellen
CREATE DATABASE flexiplatform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Benutzer erstellen
CREATE USER 'flexiplatform'@'localhost' IDENTIFIED BY 'your_password';

-- Berechtigungen erteilen
GRANT ALL PRIVILEGES ON flexiplatform.* TO 'flexiplatform'@'localhost';
FLUSH PRIVILEGES;

-- Beenden
EXIT;
```

Führen Sie die Datenbank-Migrationen durch:

```bash
pnpm db:push
```

#### Schritt 7: Entwicklungsserver starten

```bash
pnpm dev
```

Die Anwendung ist dann verfügbar unter:
- **Backend API**: http://localhost:3000
- **Frontend Web**: http://localhost:8081

---

### CentOS/RHEL Installation

#### Schritt 1: Systemaktualisierung

```bash
sudo yum update -y
```

#### Schritt 2: Voraussetzungen installieren

**Node.js und npm installieren:**

```bash
# NodeSource Repository hinzufügen
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -

# Node.js installieren
sudo yum install -y nodejs

# Überprüfung
node --version
npm --version
```

**pnpm installieren:**

```bash
npm install -g pnpm
pnpm --version
```

**Git installieren:**

```bash
sudo yum install -y git
git --version
```

**MySQL installieren:**

```bash
# MySQL Repository hinzufügen
sudo yum install -y mysql-server

# MySQL starten
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Sicherheitsskript ausführen
sudo mysql_secure_installation
```

**Build-Tools installieren:**

```bash
sudo yum groupinstall -y "Development Tools"
sudo yum install -y python3
```

#### Schritt 3-7: Gleich wie Ubuntu/Debian

Folgen Sie den Schritten 3-7 aus der Ubuntu/Debian Installation oben.

---

## macOS Installation

### Schritt 1: Voraussetzungen installieren

#### Homebrew installieren

Öffnen Sie Terminal und führen Sie aus:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Überprüfen Sie die Installation:

```bash
brew --version
```

#### Node.js installieren

```bash
brew install node@22
brew link node@22 --force

# Überprüfung
node --version
npm --version
```

#### pnpm installieren

```bash
npm install -g pnpm
pnpm --version
```

#### Git installieren

```bash
brew install git
git --version
```

#### MySQL installieren

```bash
# MySQL installieren
brew install mysql

# MySQL starten
brew services start mysql

# Sicherheitsskript ausführen
mysql_secure_installation
```

Folgen Sie den Anweisungen zur Sicherheitskonfiguration.

### Schritt 2: Repository klonen

```bash
# Navigieren Sie zu einem geeigneten Verzeichnis
cd ~/projects

# Repository klonen
git clone https://github.com/seibchristian/FlexiPlatform.git
cd FlexiPlatform
```

### Schritt 3: Abhängigkeiten installieren

```bash
pnpm install
```

### Schritt 4: Umgebungsvariablen konfigurieren

```bash
# .env.local Datei erstellen
cat > .env.local << 'EOF'
# Database Configuration
DATABASE_URL=mysql://flexiplatform:your_password@localhost:3306/flexiplatform
DB_HOST=localhost
DB_PORT=3306
DB_USER=flexiplatform
DB_PASSWORD=your_password
DB_NAME=flexiplatform

# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# App Configuration
APP_NAME=FlexiPlatform
APP_VERSION=1.0.0
APP_ENVIRONMENT=development
EOF
```

Bearbeiten Sie die Datei mit Ihren Einstellungen:

```bash
nano .env.local
```

### Schritt 5: Datenbank einrichten

```bash
# Mit MySQL verbinden
mysql -u root -p
```

Führen Sie folgende Befehle aus:

```sql
-- Datenbank erstellen
CREATE DATABASE flexiplatform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Benutzer erstellen
CREATE USER 'flexiplatform'@'localhost' IDENTIFIED BY 'your_password';

-- Berechtigungen erteilen
GRANT ALL PRIVILEGES ON flexiplatform.* TO 'flexiplatform'@'localhost';
FLUSH PRIVILEGES;

-- Beenden
EXIT;
```

Führen Sie die Datenbank-Migrationen durch:

```bash
pnpm db:push
```

### Schritt 6: Entwicklungsserver starten

```bash
pnpm dev
```

Die Anwendung ist dann verfügbar unter:
- **Backend API**: http://localhost:3000
- **Frontend Web**: http://localhost:8081

### Schritt 7: Auf echtem Gerät testen (optional)

Für Tests auf einem echten Gerät generieren Sie einen QR-Code:

```bash
pnpm qr
```

Scannen Sie den QR-Code mit der Expo Go App auf Ihrem Smartphone.

---

## Datenbank-Konfiguration

### MySQL Verbindungsoptionen

Die Datenbank kann auf verschiedene Weisen konfiguriert werden:

#### Lokale Verbindung

```env
DATABASE_URL=mysql://user:password@localhost:3306/flexiplatform
```

#### Remote-Verbindung

```env
DATABASE_URL=mysql://user:password@192.168.1.100:3306/flexiplatform
```

#### Mit SSL-Verschlüsselung

```env
DATABASE_URL=mysql://user:password@host:3306/flexiplatform?ssl=true
```

### Datenbank-Backup

**Backup erstellen:**

```bash
# Linux/macOS
mysqldump -u flexiplatform -p flexiplatform > backup.sql

# Windows (PowerShell)
mysqldump -u flexiplatform -p flexiplatform | Out-File -FilePath backup.sql
```

**Backup wiederherstellen:**

```bash
# Linux/macOS
mysql -u flexiplatform -p flexiplatform < backup.sql

# Windows (PowerShell)
Get-Content backup.sql | mysql -u flexiplatform -p flexiplatform
```

### Datenbank-Wartung

**Datenbank-Größe überprüfen:**

```sql
SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'flexiplatform'
ORDER BY size_mb DESC;
```

**Tabellen optimieren:**

```sql
OPTIMIZE TABLE plugins;
OPTIMIZE TABLE users;
OPTIMIZE TABLE printers;
OPTIMIZE TABLE servers;
OPTIMIZE TABLE databases;
```

---

## Produktivbetrieb

### Produktionsumgebung konfigurieren

Erstellen Sie eine `.env.production` Datei:

```env
# Database Configuration
DATABASE_URL=mysql://flexiplatform:strong_password@db-server:3306/flexiplatform

# Server Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# App Configuration
APP_NAME=FlexiPlatform
APP_VERSION=1.0.0
APP_ENVIRONMENT=production

# Security
JWT_SECRET=your_very_long_random_secret_key_here
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/flexiplatform/app.log
```

### Reverse Proxy mit Nginx konfigurieren

Erstellen Sie `/etc/nginx/sites-available/flexiplatform`:

```nginx
upstream flexiplatform_backend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Logging
    access_log /var/log/nginx/flexiplatform_access.log;
    error_log /var/log/nginx/flexiplatform_error.log;
    
    # Proxy Configuration
    location / {
        proxy_pass http://flexiplatform_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_min_length 1000;
}
```

Aktivieren Sie die Konfiguration:

```bash
sudo ln -s /etc/nginx/sites-available/flexiplatform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Systemd Service erstellen (Linux)

Erstellen Sie `/etc/systemd/system/flexiplatform.service`:

```ini
[Unit]
Description=FlexiPlatform Application
After=network.target mysql.service

[Service]
Type=simple
User=flexiplatform
WorkingDirectory=/opt/flexiplatform
ExecStart=/usr/local/bin/pnpm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

# Environment
Environment="NODE_ENV=production"
Environment="PORT=3000"

[Install]
WantedBy=multi-user.target
```

Aktivieren Sie den Service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable flexiplatform
sudo systemctl start flexiplatform
sudo systemctl status flexiplatform
```

### PM2 Process Manager (Alternative)

Installieren Sie PM2:

```bash
npm install -g pm2
```

Erstellen Sie `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'flexiplatform',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: '/var/log/flexiplatform/error.log',
    out_file: '/var/log/flexiplatform/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }],
};
```

Starten Sie die Anwendung:

```bash
pnpm build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### SSL/TLS mit Let's Encrypt

Installieren Sie Certbot:

```bash
# Ubuntu/Debian
sudo apt install -y certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install -y certbot python3-certbot-nginx

# macOS
brew install certbot
```

Erstellen Sie ein Zertifikat:

```bash
sudo certbot certonly --standalone -d yourdomain.com
```

Erneuern Sie Zertifikate automatisch:

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Monitoring und Logging

**Log-Datei konfigurieren:**

Erstellen Sie `/var/log/flexiplatform/` Verzeichnis:

```bash
sudo mkdir -p /var/log/flexiplatform
sudo chown -R flexiplatform:flexiplatform /var/log/flexiplatform
```

**Log-Rotation konfigurieren:**

Erstellen Sie `/etc/logrotate.d/flexiplatform`:

```
/var/log/flexiplatform/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 flexiplatform flexiplatform
    sharedscripts
    postrotate
        systemctl reload flexiplatform > /dev/null 2>&1 || true
    endscript
}
```

### Performance-Optimierung

**Node.js Heap-Größe erhöhen:**

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm start
```

**MySQL Konfiguration optimieren:**

Bearbeiten Sie `/etc/mysql/mysql.conf.d/mysqld.cnf`:

```ini
[mysqld]
# Connection Pool
max_connections = 200
max_allowed_packet = 256M

# InnoDB
innodb_buffer_pool_size = 2G
innodb_log_file_size = 512M
innodb_flush_log_at_trx_commit = 2

# Query Cache
query_cache_size = 64M
query_cache_type = 1
```

---

## Troubleshooting

### Node.js nicht gefunden

**Problem**: "node: command not found"

**Lösung**: Stellen Sie sicher, dass Node.js im PATH ist:

```bash
# Linux/macOS
which node
echo $PATH

# Windows (PowerShell)
Get-Command node
```

Installieren Sie Node.js neu, falls nötig.

### MySQL Verbindungsfehler

**Problem**: "Cannot connect to database"

**Lösung**: Überprüfen Sie die Datenbankverbindung:

```bash
# Linux/macOS
mysql -u flexiplatform -p -h localhost

# Windows (PowerShell)
mysql -u flexiplatform -p -h localhost
```

Überprüfen Sie die `DATABASE_URL` in `.env.local`.

### Port bereits in Verwendung

**Problem**: "EADDRINUSE: address already in use :::3000"

**Lösung**: Finden Sie den Prozess, der den Port verwendet:

```bash
# Linux/macOS
lsof -i :3000
kill -9 <PID>

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess
Stop-Process -Id <PID> -Force
```

### Abhängigkeiten-Fehler

**Problem**: "npm ERR! code ERESOLVE"

**Lösung**: Löschen Sie node_modules und installieren Sie neu:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Datenbank-Migrationsfehler

**Problem**: "Migration failed"

**Lösung**: Überprüfen Sie die Datenbankverbindung und führen Sie Migrationen manuell durch:

```bash
pnpm db:push --force
```

---

## Häufig gestellte Fragen

**F: Kann ich FlexiPlatform auf einem Raspberry Pi installieren?**

A: Ja, aber mit Einschränkungen. Der Raspberry Pi hat begrenzte Ressourcen. Verwenden Sie mindestens einen Raspberry Pi 4 mit 4 GB RAM.

**F: Welche MySQL-Version wird empfohlen?**

A: MySQL 8.0 oder höher. PostgreSQL ist auch unterstützt, wird aber nicht standardmäßig dokumentiert.

**F: Kann ich FlexiPlatform in Docker ausführen?**

A: Ja, Sie können ein Dockerfile erstellen. Dies ist jedoch nicht Teil dieser Anleitung.

**F: Wie aktualisiere ich FlexiPlatform?**

A: Führen Sie `git pull` aus, installieren Sie neue Abhängigkeiten mit `pnpm install` und führen Sie Migrationen durch mit `pnpm db:push`.

**F: Kann ich mehrere Instanzen von FlexiPlatform ausführen?**

A: Ja, verwenden Sie unterschiedliche Ports und Datenbanken für jede Instanz.

**F: Wie sichern Sie die Datenbank?**

A: Verwenden Sie `mysqldump` für Backups und richten Sie regelmäßige Backups mit Cron-Jobs ein.

**F: Welche Ports muss ich öffnen?**

A: Port 3000 (Backend API) und Port 8081 (Frontend Web). Für Produktivbetrieb verwenden Sie normalerweise Port 80 (HTTP) und 443 (HTTPS) mit einem Reverse Proxy.

**F: Kann ich FlexiPlatform ohne Internet ausführen?**

A: Ja, aber Sie müssen alle Abhängigkeiten offline installieren.

---

## Support und Ressourcen

- **GitHub Repository**: https://github.com/seibchristian/FlexiPlatform
- **Issue Tracker**: https://github.com/seibchristian/FlexiPlatform/issues
- **Plugin Guide**: Siehe `PLUGIN_GUIDE.md`
- **README**: Siehe `README.md`

---

**Entwickelt mit ❤️ von Manus AI**

Letztes Update: Februar 2026 | Version: 1.0.0
