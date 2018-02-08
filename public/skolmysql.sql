-- --------------------------------------------------------
drop database skolmysql;
create database skolmysql;
use skolmysql;
--
-- Estructura de tabla para la tabla `contactinfo`
--

DROP TABLE IF EXISTS `contactinfo`;
CREATE TABLE IF NOT EXISTS `contactinfo` (
  `contactInfoId` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(50) DEFAULT NULL,
  `phoneNumberAlt` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`contactInfoId`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `contactinfo`
--

INSERT INTO `contactinfo` (`contactInfoId`, `address`, `phoneNumber`, `phoneNumberAlt`, `email`) VALUES
(99, 'asdf', '1', '2', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lc_address`
--

DROP TABLE IF EXISTS `lc_address`;
CREATE TABLE IF NOT EXISTS `lc_address` (
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `personId` int(11) NOT NULL,
  PRIMARY KEY (`personId`),
  KEY `fk_lc_address_lc_person_idx` (`personId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lc_alias`
--

DROP TABLE IF EXISTS `lc_alias`;
CREATE TABLE IF NOT EXISTS `lc_alias` (
  `quality` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `aliasName` varchar(255) DEFAULT NULL,
  `personId` int(11) NOT NULL,
  PRIMARY KEY (`personId`),
  KEY `fk_lc_alias_lc_person_idx` (`personId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lc_list`
--

DROP TABLE IF EXISTS `lc_list`;
CREATE TABLE IF NOT EXISTS `lc_list` (
  `listId` int(11) NOT NULL AUTO_INCREMENT,
  `listName` varchar(255) NOT NULL,
  `listUrl` varchar(255) NOT NULL,
  `lastDayUpdated` varchar(255) DEFAULT NULL,
  `usersInList` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`listId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lc_person`
--

DROP TABLE IF EXISTS `lc_person`;
CREATE TABLE IF NOT EXISTS `lc_person` (
  `personId` int(11) NOT NULL AUTO_INCREMENT,
  `lastName` varchar(255) DEFAULT NULL,
  `personType` varchar(255) NOT NULL,
  `programList` varchar(255) DEFAULT NULL,
  `regDateList` varchar(255) DEFAULT NULL,
  `lastDayUpdated` varchar(255) DEFAULT NULL,
  `listId` int(11) NOT NULL,
  PRIMARY KEY (`personId`,`listId`),
  KEY `fk_lc_person_lc_list_idx` (`listId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `person`
--

DROP TABLE IF EXISTS `person`;
CREATE TABLE IF NOT EXISTS `person` (
  `personId` int(11) NOT NULL AUTO_INCREMENT,
  `personName` varchar(255) DEFAULT NULL,
  `personLastName` varchar(255) DEFAULT NULL,
  `birthDay` varchar(255) DEFAULT NULL,
  `genere` varchar(255) DEFAULT NULL,
  `personIcon` varchar(255) DEFAULT NULL,
  `contactInfoId` int(11) DEFAULT NULL,
  PRIMARY KEY (`personId`),
  KEY `fk_person_contactInfo_idx` (`contactInfoId`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `person`
--

INSERT INTO `person` (`personId`, `personName`, `personLastName`, `birthDay`, `genere`, `personIcon`, `contactInfoId`) VALUES
(92, 'Jhon', 'Smith', NULL, NULL, NULL, 99);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('BbIQ5Pg8lS2S9orCeJd6Lk2-MlK9zKB5', 1517977675, '{\"cookie\":{\"originalMaxAge\":300000,\"expires\":\"2018-02-07T04:23:41.963Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"userId\":30,\"userName\":\"jhon\",\"userPassword\":\"78d8045d684abd2eece923758f3cd781489df3a48e1278982466017f\",\"status\":\"1\",\"email\":\"jhoncs@gmail.com\",\"personId\":92,\"personName\":\"Jhon\",\"personLastName\":\"Smith\",\"birthDay\":null,\"genere\":null,\"personIcon\":\"images/user-profiles/male.png\",\"contactInfoId\":99},\"lang\":\"es\",\"menu\":{\"sections\":[{\"label\":\"General\",\"sideMenu\":[{\"label\":\"Administration\",\"icon\":\"fa fa-windows\",\"childMenu\":[{\"label\":\"Configuration\",\"subChildMenu\":[{\"label\":\"UsersSystem\",\"href\":\"#!/userSystem\"}]}]}]}]},\"modules\":{\"working-group\":{\"index\":{\"href\":\"#!/workingGroup\",\"icon\":\"fa fa-users\",\"title\":\"WorkingGroup\",\"category\":\"Configuration\"},\"get\":{\"href\":\"#!/workingGroup/get\",\"controller\":\"workingGroupCtrl\"}},\"user-system\":{\"index\":{\"href\":\"#!/userSystem\",\"icon\":\"fa fa-user\",\"label\":\"UsersSystem\",\"category\":\"Configuration\"},\"get\":{\"href\":\"#!/userSystem/get\"},\"set\":{\"href\":\"#!/userSystem/set\"}}},\"workingGroups\":[{\"workingGroupId\":1,\"workingGroupName\":\"Administrador\",\"permissions\":{\"user-system\":[\"index\",\"get\",\"set\"]}},{\"workingGroupId\":2,\"workingGroupName\":\"Consultor\",\"permissions\":{\"working-group\":[\"index\",\"get\"]}}]}'),
('GkNB_T9QuDv9eFM7veaXKiy58ylMtdMj', 1517978231, '{\"cookie\":{\"originalMaxAge\":300000,\"expires\":\"2018-02-07T04:35:16.183Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"userId\":30,\"userName\":\"jhon\",\"userPassword\":\"78d8045d684abd2eece923758f3cd781489df3a48e1278982466017f\",\"status\":\"1\",\"email\":\"jhoncs@gmail.com\",\"personId\":92,\"personName\":\"Jhon\",\"personLastName\":\"Smith\",\"birthDay\":null,\"genere\":null,\"personIcon\":\"images/user-profiles/male.png\",\"contactInfoId\":99},\"lang\":\"es\",\"menu\":{\"sections\":[{\"label\":\"General\",\"sideMenu\":[{\"label\":\"Administration\",\"icon\":\"fa fa-windows\",\"childMenu\":[{\"label\":\"Configuration\",\"subChildMenu\":[{\"label\":\"UsersSystem\",\"href\":\"#!/userSystem\"}]}]}]}]},\"modules\":{\"working-group\":{\"index\":{\"href\":\"#!/workingGroup\",\"icon\":\"fa fa-users\",\"title\":\"WorkingGroup\",\"category\":\"Configuration\"},\"get\":{\"href\":\"#!/workingGroup/get\",\"controller\":\"workingGroupCtrl\"}},\"user-system\":{\"index\":{\"href\":\"#!/userSystem\",\"icon\":\"fa fa-user\",\"label\":\"UsersSystem\",\"category\":\"Configuration\"},\"get\":{\"href\":\"#!/userSystem/get\"},\"set\":{\"href\":\"#!/userSystem/set\"}}},\"workingGroups\":[{\"workingGroupId\":1,\"workingGroupName\":\"Administrador\",\"permissions\":{\"user-system\":[\"index\",\"get\",\"set\"]}},{\"workingGroupId\":2,\"workingGroupName\":\"Consultor\",\"permissions\":{\"working-group\":[\"index\",\"get\"]}}]}'),
('TRnQPppflbFmWklo5ZCLB6eSGTpL0JSW', 1517977967, '{\"cookie\":{\"originalMaxAge\":300000,\"expires\":\"2018-02-07T04:29:16.730Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"userId\":30,\"userName\":\"jhon\",\"userPassword\":\"78d8045d684abd2eece923758f3cd781489df3a48e1278982466017f\",\"status\":\"1\",\"email\":\"jhoncs@gmail.com\",\"personId\":92,\"personName\":\"Jhon\",\"personLastName\":\"Smith\",\"birthDay\":null,\"genere\":null,\"personIcon\":\"images/user-profiles/male.png\",\"contactInfoId\":99},\"lang\":\"es\",\"menu\":{\"sections\":[{\"label\":\"General\",\"sideMenu\":[{\"label\":\"Administration\",\"icon\":\"fa fa-windows\",\"childMenu\":[{\"label\":\"Configuration\",\"subChildMenu\":[{\"label\":\"UsersSystem\",\"href\":\"#!/userSystem\"}]}]}]}]},\"modules\":{\"working-group\":{\"index\":{\"href\":\"#!/workingGroup\",\"icon\":\"fa fa-users\",\"title\":\"WorkingGroup\",\"category\":\"Configuration\"},\"get\":{\"href\":\"#!/workingGroup/get\",\"controller\":\"workingGroupCtrl\"}},\"user-system\":{\"index\":{\"href\":\"#!/userSystem\",\"icon\":\"fa fa-user\",\"label\":\"UsersSystem\",\"category\":\"Configuration\"},\"get\":{\"href\":\"#!/userSystem/get\"},\"set\":{\"href\":\"#!/userSystem/set\"}}},\"workingGroups\":[{\"workingGroupId\":1,\"workingGroupName\":\"Administrador\",\"permissions\":{\"user-system\":[\"index\",\"get\",\"set\"]}},{\"workingGroupId\":2,\"workingGroupName\":\"Consultor\",\"permissions\":{\"working-group\":[\"index\",\"get\"]}}]}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) NOT NULL,
  `userPassword` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `personId` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT '1',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userName` (`userName`),
  KEY `fk_user_person_idx` (`personId`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`userId`, `userName`, `userPassword`, `email`, `personId`, `status`) VALUES
(30, 'jhon', '78d8045d684abd2eece923758f3cd781489df3a48e1278982466017f', 'jhoncs@gmail.com', 92, '1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `userworkinggroup`
--

DROP TABLE IF EXISTS `userworkinggroup`;
CREATE TABLE IF NOT EXISTS `userworkinggroup` (
  `date` varchar(255) NOT NULL,
  `workingGroupid` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`workingGroupid`,`userId`),
  KEY `fk_userWorkingGroup_workingGroup_idx` (`workingGroupid`),
  KEY `fk_userWorkingGroup_user1_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `userworkinggroup`
--

INSERT INTO `userworkinggroup` (`date`, `workingGroupid`, `userId`) VALUES
('', 1, 30),
('', 2, 30);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `workinggroup`
--

DROP TABLE IF EXISTS `workinggroup`;
CREATE TABLE IF NOT EXISTS `workinggroup` (
  `workingGroupid` int(11) NOT NULL AUTO_INCREMENT,
  `workingGroupName` varchar(255) NOT NULL,
  `permissions` varchar(255) NOT NULL,
  PRIMARY KEY (`workingGroupid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `workinggroup`
--

INSERT INTO `workinggroup` (`workingGroupid`, `workingGroupName`, `permissions`) VALUES
(1, 'Administrador', '{\"user-system\":[\"index\",\"get\",\"set\"]}'),
(2, 'Consultor', '{\"working-group\":[\"index\",\"get\"]}');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `lc_address`
--
ALTER TABLE `lc_address`
  ADD CONSTRAINT `fk_lc_address_lc_person0` FOREIGN KEY (`personId`) REFERENCES `lc_person` (`personId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `lc_alias`
--
ALTER TABLE `lc_alias`
  ADD CONSTRAINT `fk_lc_alias_lc_person0` FOREIGN KEY (`personId`) REFERENCES `lc_person` (`personId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `lc_person`
--
ALTER TABLE `lc_person`
  ADD CONSTRAINT `fk_lc_person_lc_list0` FOREIGN KEY (`listId`) REFERENCES `lc_list` (`listId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `person`
--
ALTER TABLE `person`
  ADD CONSTRAINT `fk_person_contactInfo0` FOREIGN KEY (`contactInfoId`) REFERENCES `contactinfo` (`contactInfoId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_user_person0` FOREIGN KEY (`personId`) REFERENCES `person` (`personId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `userworkinggroup`
--
ALTER TABLE `userworkinggroup`
  ADD CONSTRAINT `fk_userWorkingGroup_user1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_userWorkingGroup_workingGroup0` FOREIGN KEY (`workingGroupid`) REFERENCES `workinggroup` (`workingGroupid`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
