CREATE TABLE `activity_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(255) NOT NULL,
	`entity` varchar(100) NOT NULL,
	`entityId` int,
	`details` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `database_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dbType` varchar(50) NOT NULL,
	`host` varchar(255) NOT NULL,
	`port` int NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`database` varchar(255) NOT NULL,
	`status` enum('connected','disconnected','error') NOT NULL DEFAULT 'disconnected',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `database_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plugins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`version` varchar(50) NOT NULL,
	`description` text,
	`enabled` boolean NOT NULL DEFAULT true,
	`config` json NOT NULL DEFAULT ('{}'),
	`author` varchar(255),
	`homepage` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plugins_id` PRIMARY KEY(`id`),
	CONSTRAINT `plugins_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `printers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`ipAddress` varchar(50) NOT NULL,
	`port` int NOT NULL DEFAULT 9100,
	`model` varchar(255),
	`status` enum('online','offline','error') NOT NULL DEFAULT 'offline',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `printers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `server_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text,
	`type` enum('string','number','boolean','json') NOT NULL DEFAULT 'string',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `server_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `server_settings_key_unique` UNIQUE(`key`)
);
