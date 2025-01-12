CREATE DATABASE IF NOT EXISTS `estoque` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `estoque`;

DROP TABLE products;

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `imageBlob` LONGBLOB,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `value` DECIMAL(10,2) DEFAULT 0.00,
  `quantity` INT DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `products` (`id`, `imageBlob`, `name`, `description`, `value`, `quantity`) VALUES
(1, NULL, 'Notebook Dell', 'Notebook Dell com 16GB RAM e 512GB SSD', 6500.00, 10),
(2, NULL, 'Mouse Logitech', 'Mouse sem fio Logitech modelo M185', 120.00, 50),
(3, NULL, 'Monitor LG', 'Monitor LG 24 polegadas Full HD', 950.00, 20),
(4, NULL, 'Teclado Mecânico Razer', 'Teclado mecânico com iluminação RGB', 450.00, 15);
