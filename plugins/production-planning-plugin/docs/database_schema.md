# Datenbank-Schema für das Produktionsplanungs-Plugin

Das Produktionsplanungs-Plugin wird die folgenden Entitäten verwalten:

1.  **Kunden (Customers)**
2.  **Produkte (Products)**
3.  **Aufträge (Orders)**
4.  **Auftragspositionen (OrderItems)**

## 1. Kunden (Customers)

| Feldname        | Datentyp    | Beschreibung                                   | Constraints      |
| :-------------- | :---------- | :--------------------------------------------- | :--------------- |
| `id`            | `INT`       | Eindeutige Kunden-ID                           | `PRIMARY KEY`, `AUTO_INCREMENT` |
| `customerNumber`| `VARCHAR(50)`| Eindeutige Kundennummer                       | `UNIQUE`, `NOT NULL` |
| `name`          | `VARCHAR(255)`| Name des Kunden                                | `NOT NULL`       |
| `address`       | `TEXT`      | Adresse des Kunden                             |                  |
| `contactPerson` | `VARCHAR(255)`| Ansprechpartner                                |                  |
| `email`         | `VARCHAR(255)`| E-Mail-Adresse des Kunden                      |                  |
| `phone`         | `VARCHAR(50)`| Telefonnummer des Kunden                       |                  |
| `isArchived`    | `BOOLEAN`   | Gibt an, ob der Kunde archiviert ist           | `DEFAULT FALSE`  |
| `createdAt`     | `DATETIME`  | Erstellungsdatum des Eintrags                  | `DEFAULT CURRENT_TIMESTAMP` |
| `updatedAt`     | `DATETIME`  | Datum der letzten Aktualisierung des Eintrags  | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` |

## 2. Produkte (Products)

| Feldname        | Datentyp    | Beschreibung                                   | Constraints      |
| :-------------- | :---------- | :--------------------------------------------- | :--------------- |
| `id`            | `INT`       | Eindeutige Produkt-ID                          | `PRIMARY KEY`, `AUTO_INCREMENT` |
| `articleNumber` | `VARCHAR(50)`| Eindeutige Artikelnummer                      | `UNIQUE`, `NOT NULL` |
| `name`          | `VARCHAR(255)`| Name des Produkts                              | `NOT NULL`       |
| `description`   | `TEXT`      | Beschreibung des Produkts                      |                  |
| `price`         | `DECIMAL(10,2)`| Preis pro Einheit                             | `NOT NULL`       |
| `category`      | `VARCHAR(100)`| Produktkategorie                              |                  |
| `imageUrl`      | `VARCHAR(255)`| URL des Produktbildes                         |                  |
| `createdAt`     | `DATETIME`  | Erstellungsdatum des Eintrags                  | `DEFAULT CURRENT_TIMESTAMP` |
| `updatedAt`     | `DATETIME`  | Datum der letzten Aktualisierung des Eintrags  | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` |

## 3. Aufträge (Orders)

| Feldname        | Datentyp    | Beschreibung                                   | Constraints      |
| :-------------- | :---------- | :--------------------------------------------- | :--------------- |
| `id`            | `INT`       | Eindeutige Auftrags-ID                         | `PRIMARY KEY`, `AUTO_INCREMENT` |
| `orderNumber`   | `VARCHAR(50)`| Eindeutige Auftragsnummer                     | `UNIQUE`, `NOT NULL` |
| `customerId`    | `INT`       | Referenz zur Kunden-ID                         | `FOREIGN KEY (Customers.id)`, `NOT NULL` |
| `orderDate`     | `DATETIME`  | Datum der Auftragserstellung                   | `DEFAULT CURRENT_TIMESTAMP` |
| `status`        | `ENUM`      | Status des Auftrags (Neu, In Bearbeitung, Fertig) | `NOT NULL`, `DEFAULT 'Neu'` |
| `totalAmount`   | `DECIMAL(10,2)`| Gesamtsumme des Auftrags                      | `DEFAULT 0.00`   |
| `createdAt`     | `DATETIME`  | Erstellungsdatum des Eintrags                  | `DEFAULT CURRENT_TIMESTAMP` |
| `updatedAt`     | `DATETIME`  | Datum der letzten Aktualisierung des Eintrags  | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` |

## 4. Auftragspositionen (OrderItems)

| Feldname        | Datentyp    | Beschreibung                                   | Constraints      |
| :-------------- | :---------- | :--------------------------------------------- | :--------------- |
| `id`            | `INT`       | Eindeutige Auftragspositions-ID                | `PRIMARY KEY`, `AUTO_INCREMENT` |
| `orderId`       | `INT`       | Referenz zur Auftrags-ID                       | `FOREIGN KEY (Orders.id)`, `NOT NULL` |
| `productId`     | `INT`       | Referenz zur Produkt-ID                        | `FOREIGN KEY (Products.id)`, `NOT NULL` |
| `quantity`      | `INT`       | Menge des Produkts in dieser Position          | `NOT NULL`, `DEFAULT 1` |
| `unitPrice`     | `DECIMAL(10,2)`| Preis pro Einheit zum Zeitpunkt der Bestellung | `NOT NULL`       |
| `totalPrice`    | `DECIMAL(10,2)`| Gesamtpreis für diese Position                | `NOT NULL`       |
| `createdAt`     | `DATETIME`  | Erstellungsdatum des Eintrags                  | `DEFAULT CURRENT_TIMESTAMP` |
| `updatedAt`     | `DATETIME`  | Datum der letzten Aktualisierung des Eintrags  | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` |

## Beziehungen

-   Ein `Kunde` kann mehrere `Aufträge` haben (One-to-Many: `Customers.id` -> `Orders.customerId`).
-   Ein `Auftrag` kann mehrere `Auftragspositionen` haben (One-to-Many: `Orders.id` -> `OrderItems.orderId`).
-   Eine `Auftragsposition` bezieht sich auf ein `Produkt` (Many-to-One: `OrderItems.productId` -> `Products.id`).

## API-Endpunkte für das Produktionsplanungs-Plugin

Basierend auf der tRPC-Implementierung der FlexiPlatform werden die API-Endpunkte wie folgt strukturiert:

### Kundenverwaltung

-   `GET /api/trpc/productionPlanning.customers.list`: Alle Kunden auflisten (optional mit Filter für archivierte Kunden).
-   `GET /api/trpc/productionPlanning.customers.getById`: Einen spezifischen Kunden anhand der ID abrufen.
-   `POST /api/trpc/productionPlanning.customers.create`: Einen neuen Kunden anlegen.
-   `PUT /api/trpc/productionPlanning.customers.update`: Einen bestehenden Kunden aktualisieren.
-   `DELETE /api/trpc/productionPlanning.customers.archive`: Einen Kunden archivieren (soft delete).
-   `DELETE /api/trpc/productionPlanning.customers.unarchive`: Einen Kunden de-archivieren.

### Produktdatenbank

-   `GET /api/trpc/productionPlanning.products.list`: Alle Produkte auflisten.
-   `GET /api/trpc/productionPlanning.products.getById`: Ein spezifisches Produkt anhand der ID abrufen.
-   `POST /api/trpc/productionPlanning.products.create`: Ein neues Produkt anlegen.
-   `PUT /api/trpc/productionPlanning.products.update`: Ein bestehendes Produkt aktualisieren.
-   `DELETE /api/trpc/productionPlanning.products.delete`: Ein Produkt löschen.

### Auftragssystem

-   `GET /api/trpc/productionPlanning.orders.list`: Alle Aufträge auflisten (optional mit Filter nach Kunde oder Status).
-   `GET /api/trpc/productionPlanning.orders.getById`: Einen spezifischen Auftrag anhand der ID abrufen (inklusive Auftragspositionen).
-   `POST /api/trpc/productionPlanning.orders.create`: Einen neuen Auftrag anlegen (inklusive Auftragspositionen).
-   `PUT /api/trpc/productionPlanning.orders.update`: Einen bestehenden Auftrag aktualisieren (inklusive Auftragspositionen).
-   `PUT /api/trpc/productionPlanning.orders.updateStatus`: Den Status eines Auftrags aktualisieren.
-   `DELETE /api/trpc/productionPlanning.orders.delete`: Einen Auftrag löschen.

### Druckfunktion

-   `GET /api/trpc/productionPlanning.orders.generatePrintableOrder`: Ein druckbares Auftragsblatt für einen spezifischen Auftrag generieren (z.B. als PDF).
