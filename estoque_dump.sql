CREATE DATABASE IF NOT EXISTS `estoque` ;
USE `estoque`;

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `imageBlob` LONGBLOB,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
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


INSERT INTO `products` (`id`, `imageBlob`, `name`, `description`, `quantity`) VALUES
(1, NULL, 'Notebook Dell', 'Notebook Dell com 16GB RAM e 512GB SSD', 10),
(2, NULL, 'Mouse Logitech', 'Mouse sem fio Logitech modelo M185', 50),
(3, NULL, 'Monitor LG', 'Monitor LG 24 polegadas Full HD', 20),
(4, NULL, 'Teclado Mecânico Razer', 'Teclado mecânico com iluminação RGB', 15);


INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'admin', 'admin@example.com', 'admin123'),
(2, 'johndoe', 'john.doe@example.com', 'password123'),
(3, 'janedoe', 'jane.doe@example.com', 'password456'),
(4, 'guest', 'guest@example.com', 'guestpass');
