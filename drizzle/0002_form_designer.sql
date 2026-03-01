-- Form Designer Schema
-- Stores form configurations for all entities (customers, products, orders, etc.)

CREATE TABLE IF NOT EXISTS `form_definitions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `entityType` VARCHAR(100) NOT NULL UNIQUE,
  `displayName` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `fields` JSON NOT NULL DEFAULT '[]',
  `isActive` BOOLEAN DEFAULT TRUE,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_entityType (`entityType`)
);

-- Form Field Configurations
-- Each field in a form definition
CREATE TABLE IF NOT EXISTS `form_fields` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `formDefinitionId` INT NOT NULL,
  `fieldName` VARCHAR(255) NOT NULL,
  `fieldLabel` VARCHAR(255) NOT NULL,
  `fieldType` VARCHAR(50) NOT NULL,
  `position` INT NOT NULL,
  `width` INT DEFAULT 100,
  `height` INT DEFAULT 40,
  `isRequired` BOOLEAN DEFAULT FALSE,
  `placeholder` VARCHAR(255),
  `defaultValue` VARCHAR(255),
  `options` JSON,
  `validation` JSON,
  `metadata` JSON,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`formDefinitionId`) REFERENCES `form_definitions`(`id`) ON DELETE CASCADE,
  INDEX idx_formDefinitionId (`formDefinitionId`),
  UNIQUE KEY unique_field_per_form (`formDefinitionId`, `fieldName`)
);

-- Form Design History
-- Track changes to form configurations
CREATE TABLE IF NOT EXISTS `form_design_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `formDefinitionId` INT NOT NULL,
  `userId` INT,
  `action` VARCHAR(50) NOT NULL,
  `previousConfig` JSON,
  `newConfig` JSON,
  `description` TEXT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`formDefinitionId`) REFERENCES `form_definitions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX idx_formDefinitionId (`formDefinitionId`),
  INDEX idx_userId (`userId`)
);
