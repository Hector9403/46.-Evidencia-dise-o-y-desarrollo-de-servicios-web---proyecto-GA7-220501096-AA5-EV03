CREATE DATABASE IF NOT EXISTS `azmevet3` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `azmevet3`;

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(20) NOT NULL,
  `password` varchar(12) NOT NULL,
  `email` varchar(50) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `usuarios` (`id`, `usuario`, `password`, `email`,`nombre`,`cedula`) VALUES (1, 'test', 'test', 'test@test.com','Nombre test','1234567890');