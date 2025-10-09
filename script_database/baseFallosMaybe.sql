-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: herbarium_cib
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `abundance`
--

DROP TABLE IF EXISTS `abundance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `abundance` (
  `idAbundance` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`idAbundance`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `biologicalform`
--

DROP TABLE IF EXISTS `biologicalform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biologicalform` (
  `idBiologicalForm` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`idBiologicalForm`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `collection`
--

DROP TABLE IF EXISTS `collection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collection` (
  `idCollection` int NOT NULL AUTO_INCREMENT,
  `collectionNumber` int NOT NULL,
  `localName` varchar(100) DEFAULT NULL,
  `collectionDate` date NOT NULL,
  `fieldNotebookImage` varchar(255) DEFAULT NULL,
  `idSpecimen` varchar(15) NOT NULL,
  `idMicrohabitat` int DEFAULT NULL,
  PRIMARY KEY (`idCollection`),
  KEY `idSpecimen` (`idSpecimen`),
  KEY `idMicrohabitat` (`idMicrohabitat`),
  CONSTRAINT `collection_ibfk_1` FOREIGN KEY (`idSpecimen`) REFERENCES `specimen` (`idSpecimen`) ON DELETE CASCADE,
  CONSTRAINT `collection_ibfk_2` FOREIGN KEY (`idMicrohabitat`) REFERENCES `microhabitat` (`idMicrohabitat`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `collectionaddress`
--

DROP TABLE IF EXISTS `collectionaddress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collectionaddress` (
  `idCollectionAddress` int NOT NULL AUTO_INCREMENT,
  `idCollection` int DEFAULT NULL,
  `idCountry` int DEFAULT NULL,
  `idState` int DEFAULT NULL,
  `idMunicipality` int DEFAULT NULL,
  `idLocality` int DEFAULT NULL,
  PRIMARY KEY (`idCollectionAddress`),
  KEY `idCollection` (`idCollection`),
  KEY `idState` (`idState`),
  KEY `idMunicipality` (`idMunicipality`),
  KEY `idLocality` (`idLocality`),
  CONSTRAINT `collectionaddress_ibfk_1` FOREIGN KEY (`idCollection`) REFERENCES `collection` (`idCollection`) ON DELETE CASCADE,
  CONSTRAINT `collectionaddress_ibfk_2` FOREIGN KEY (`idState`) REFERENCES `state` (`idState`) ON DELETE CASCADE,
  CONSTRAINT `collectionaddress_ibfk_3` FOREIGN KEY (`idMunicipality`) REFERENCES `municipality` (`idMunicipality`) ON DELETE CASCADE,
  CONSTRAINT `collectionaddress_ibfk_4` FOREIGN KEY (`idLocality`) REFERENCES `locality` (`idLocality`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `collectioncollector`
--

DROP TABLE IF EXISTS `collectioncollector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collectioncollector` (
  `idCollectionCollector` int NOT NULL AUTO_INCREMENT,
  `idCollection` int DEFAULT NULL,
  `id_collector` int DEFAULT NULL,
  PRIMARY KEY (`idCollectionCollector`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `collector`
--

DROP TABLE IF EXISTS `collector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collector` (
  `id_collector` int NOT NULL AUTO_INCREMENT,
  `names` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `first_surname` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `second_surname` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ascription` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `pdf_file` blob,
  `is_associated` tinyint DEFAULT NULL,
  `prefix` char(10) DEFAULT NULL,
  `id_collection` int DEFAULT NULL,
  `pdf_filename` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_collector`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `collector_requests`
--

DROP TABLE IF EXISTS `collector_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collector_requests` (
  `id_request` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `first_surname` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `second_surname` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ref_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ref_first_surname` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ref_second_surname` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ref_email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `curriculum` longblob,
  `curriculum_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `permit` longblob,
  `permit_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `letter` longblob,
  `letter_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `proyect` longblob,
  `proyect_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_request`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `coordinates`
--

DROP TABLE IF EXISTS `coordinates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coordinates` (
  `idCoordinates` int NOT NULL AUTO_INCREMENT,
  `latitude` decimal(10,6) DEFAULT NULL,
  `longitude` decimal(10,6) DEFAULT NULL,
  `altitude` decimal(10,2) DEFAULT NULL,
  `idCollectionAddress` int DEFAULT NULL,
  PRIMARY KEY (`idCoordinates`),
  KEY `idCollectionAddress` (`idCollectionAddress`),
  CONSTRAINT `coordinates_ibfk_1` FOREIGN KEY (`idCollectionAddress`) REFERENCES `collectionaddress` (`idCollectionAddress`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country` (
  `idCountry` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idCountry`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `determiner`
--

DROP TABLE IF EXISTS `determiner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `determiner` (
  `idDeterminer` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(100) NOT NULL,
  `lastNameP` varchar(50) DEFAULT NULL,
  `lastNameM` varchar(50) DEFAULT NULL,
  `determinationDate` date NOT NULL,
  PRIMARY KEY (`idDeterminer`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `determinersspecimens`
--

DROP TABLE IF EXISTS `determinersspecimens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `determinersspecimens` (
  `idDeterminersSpecimens` int NOT NULL AUTO_INCREMENT,
  `idDeterminer` int DEFAULT NULL,
  `idSpecimen` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`idDeterminersSpecimens`),
  KEY `idDeterminer` (`idDeterminer`),
  KEY `idSpecimen` (`idSpecimen`),
  CONSTRAINT `determinersspecimens_ibfk_1` FOREIGN KEY (`idDeterminer`) REFERENCES `determiner` (`idDeterminer`) ON DELETE CASCADE,
  CONSTRAINT `determinersspecimens_ibfk_2` FOREIGN KEY (`idSpecimen`) REFERENCES `specimen` (`idSpecimen`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `family`
--

DROP TABLE IF EXISTS `family`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `family` (
  `idFamily` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`idFamily`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `flower`
--

DROP TABLE IF EXISTS `flower`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flower` (
  `idFlower` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`idFlower`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fruit`
--

DROP TABLE IF EXISTS `fruit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fruit` (
  `idFruit` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`idFruit`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `genus`
--

DROP TABLE IF EXISTS `genus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genus` (
  `idGenus` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`idGenus`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gmscoordinates`
--

DROP TABLE IF EXISTS `gmscoordinates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gmscoordinates` (
  `idGMSCoordinates` int NOT NULL AUTO_INCREMENT,
  `longDegrees` int DEFAULT NULL,
  `longMinutes` int DEFAULT NULL,
  `longSeconds` int DEFAULT NULL,
  `latDegrees` int DEFAULT NULL,
  `latMinutes` int DEFAULT NULL,
  `latSeconds` int DEFAULT NULL,
  `idCollectionAddress` int DEFAULT NULL,
  PRIMARY KEY (`idGMSCoordinates`),
  KEY `idCollectionAddress` (`idCollectionAddress`),
  CONSTRAINT `gmscoordinates_ibfk_1` FOREIGN KEY (`idCollectionAddress`) REFERENCES `collectionaddress` (`idCollectionAddress`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `locality`
--

DROP TABLE IF EXISTS `locality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locality` (
  `idLocality` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `idMunicipality` int NOT NULL,
  PRIMARY KEY (`idLocality`),
  KEY `idMunicipality` (`idMunicipality`),
  CONSTRAINT `locality_ibfk_1` FOREIGN KEY (`idMunicipality`) REFERENCES `municipality` (`idMunicipality`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `microhabitat`
--

DROP TABLE IF EXISTS `microhabitat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `microhabitat` (
  `idMicrohabitat` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`idMicrohabitat`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `municipality`
--

DROP TABLE IF EXISTS `municipality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `municipality` (
  `idMunicipality` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `idState` int NOT NULL,
  PRIMARY KEY (`idMunicipality`),
  KEY `idState` (`idState`),
  CONSTRAINT `municipality_ibfk_1` FOREIGN KEY (`idState`) REFERENCES `state` (`idState`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plantclassification`
--

DROP TABLE IF EXISTS `plantclassification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantclassification` (
  `idPlantClassification` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`idPlantClassification`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `protected_request`
--

DROP TABLE IF EXISTS `protected_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `protected_request` (
  `id_request` int NOT NULL AUTO_INCREMENT,
  `id_specimen` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`id_request`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `protectedspecimens`
--

DROP TABLE IF EXISTS `protectedspecimens`;
/*!50001 DROP VIEW IF EXISTS `protectedspecimens`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `protectedspecimens` AS SELECT 
 1 AS `idSpecimen`,
 1 AS `associated`,
 1 AS `size`,
 1 AS `duplicates`,
 1 AS `additionalData`,
 1 AS `environmentalInformation`,
 1 AS `family`,
 1 AS `genus`,
 1 AS `species`,
 1 AS `vegetationType`,
 1 AS `soil`,
 1 AS `biologicalForm`,
 1 AS `fruit`,
 1 AS `flower`,
 1 AS `abundance`,
 1 AS `plantClassification`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `scientificname`
--

DROP TABLE IF EXISTS `scientificname`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scientificname` (
  `idScientificName` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `isCurrent` tinyint(1) NOT NULL,
  `assignmentDate` date NOT NULL,
  `idSpecimen` varchar(15) NOT NULL,
  `idFamily` int NOT NULL,
  `idGenus` int DEFAULT NULL,
  `idSpecies` int DEFAULT NULL,
  PRIMARY KEY (`idScientificName`),
  KEY `idSpecimen` (`idSpecimen`),
  KEY `idFamily` (`idFamily`),
  KEY `idGenus` (`idGenus`),
  KEY `idSpecies` (`idSpecies`),
  CONSTRAINT `scientificname_ibfk_1` FOREIGN KEY (`idSpecimen`) REFERENCES `specimen` (`idSpecimen`) ON DELETE CASCADE,
  CONSTRAINT `scientificname_ibfk_2` FOREIGN KEY (`idFamily`) REFERENCES `family` (`idFamily`) ON DELETE CASCADE,
  CONSTRAINT `scientificname_ibfk_3` FOREIGN KEY (`idGenus`) REFERENCES `genus` (`idGenus`) ON DELETE CASCADE,
  CONSTRAINT `scientificname_ibfk_4` FOREIGN KEY (`idSpecies`) REFERENCES `species` (`idSpecies`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `soil`
--

DROP TABLE IF EXISTS `soil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `soil` (
  `idSoil` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`idSoil`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `species`
--

DROP TABLE IF EXISTS `species`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `species` (
  `idSpecies` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`idSpecies`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `speciesauthor`
--

DROP TABLE IF EXISTS `speciesauthor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `speciesauthor` (
  `idSpeciesAuthor` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `middleName` varchar(100) NOT NULL,
  PRIMARY KEY (`idSpeciesAuthor`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `speciesauthors`
--

DROP TABLE IF EXISTS `speciesauthors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `speciesauthors` (
  `idSpeciesAuthors` int NOT NULL AUTO_INCREMENT,
  `idSpecies` int DEFAULT NULL,
  `idSpeciesAuthor` int DEFAULT NULL,
  PRIMARY KEY (`idSpeciesAuthors`),
  KEY `idSpecies` (`idSpecies`),
  KEY `idSpeciesAuthor` (`idSpeciesAuthor`),
  CONSTRAINT `speciesauthors_ibfk_1` FOREIGN KEY (`idSpecies`) REFERENCES `species` (`idSpecies`) ON DELETE CASCADE,
  CONSTRAINT `speciesauthors_ibfk_2` FOREIGN KEY (`idSpeciesAuthor`) REFERENCES `speciesauthor` (`idSpeciesAuthor`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `specimen`
--

DROP TABLE IF EXISTS `specimen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specimen` (
  `idSpecimen` varchar(30) NOT NULL,
  `specimenState` tinyint(1) NOT NULL,
  `associated` varchar(100) DEFAULT NULL,
  `lifeCycle` int DEFAULT NULL,
  `size` float DEFAULT NULL,
  `duplicates` int NOT NULL,
  `additionalData` varchar(400) DEFAULT NULL,
  `protected` tinyint(1) NOT NULL,
  `environmentalInformation` varchar(400) DEFAULT NULL,
  `specimenImage` varchar(255) DEFAULT NULL,
  `idVegetationType` int DEFAULT NULL,
  `idSoil` int DEFAULT NULL,
  `idBiologicalForm` int DEFAULT NULL,
  `idFruit` int DEFAULT NULL,
  `idFlower` int DEFAULT NULL,
  `idAbundance` int NOT NULL,
  `idPlantClassification` int NOT NULL,
  `is_validated` tinyint(1) DEFAULT NULL,
  `collector_email` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`idSpecimen`),
  KEY `idVegetationType` (`idVegetationType`),
  KEY `idSoil` (`idSoil`),
  KEY `idBiologicalForm` (`idBiologicalForm`),
  KEY `idFruit` (`idFruit`),
  KEY `idFlower` (`idFlower`),
  KEY `idAbundance` (`idAbundance`),
  KEY `idPlantClassification` (`idPlantClassification`),
  CONSTRAINT `specimen_ibfk_1` FOREIGN KEY (`idVegetationType`) REFERENCES `vegetationtype` (`idVegetationType`) ON DELETE CASCADE,
  CONSTRAINT `specimen_ibfk_2` FOREIGN KEY (`idSoil`) REFERENCES `soil` (`idSoil`) ON DELETE CASCADE,
  CONSTRAINT `specimen_ibfk_3` FOREIGN KEY (`idBiologicalForm`) REFERENCES `biologicalform` (`idBiologicalForm`) ON DELETE CASCADE,
  CONSTRAINT `specimen_ibfk_4` FOREIGN KEY (`idFruit`) REFERENCES `fruit` (`idFruit`) ON DELETE CASCADE,
  CONSTRAINT `specimen_ibfk_5` FOREIGN KEY (`idFlower`) REFERENCES `flower` (`idFlower`) ON DELETE CASCADE,
  CONSTRAINT `specimen_ibfk_6` FOREIGN KEY (`idAbundance`) REFERENCES `abundance` (`idAbundance`) ON DELETE CASCADE,
  CONSTRAINT `specimen_ibfk_7` FOREIGN KEY (`idPlantClassification`) REFERENCES `plantclassification` (`idPlantClassification`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `state`
--

DROP TABLE IF EXISTS `state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `state` (
  `idState` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `idCountry` int NOT NULL,
  PRIMARY KEY (`idState`),
  KEY `idCountry` (`idCountry`),
  CONSTRAINT `state_ibfk_1` FOREIGN KEY (`idCountry`) REFERENCES `country` (`idCountry`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(250) NOT NULL,
  `first_surname` varchar(250) NOT NULL,
  `second_surname` varchar(250) NOT NULL,
  `role_id` int NOT NULL,
  `verification_token` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expire` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`email`),
  KEY `fk_users_roles` (`role_id`),
  CONSTRAINT `fk_users_roles` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vegetationtype`
--

DROP TABLE IF EXISTS `vegetationtype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vegetationtype` (
  `idVegetationType` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`idVegetationType`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `vistaejemplardetalles`
--

DROP TABLE IF EXISTS `vistaejemplardetalles`;
/*!50001 DROP VIEW IF EXISTS `vistaejemplardetalles`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vistaejemplardetalles` AS SELECT 
 1 AS `idSpecimen`,
 1 AS `ScientificName`,
 1 AS `PlantClassification`,
 1 AS `Abundance`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `protectedspecimens`
--

/*!50001 DROP VIEW IF EXISTS `protectedspecimens`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `protectedspecimens` AS select `s`.`idSpecimen` AS `idSpecimen`,`s`.`associated` AS `associated`,`s`.`size` AS `size`,`s`.`duplicates` AS `duplicates`,`s`.`additionalData` AS `additionalData`,`s`.`environmentalInformation` AS `environmentalInformation`,`f`.`name` AS `family`,`g`.`name` AS `genus`,`sp`.`name` AS `species`,`vt`.`name` AS `vegetationType`,`so`.`name` AS `soil`,`bf`.`name` AS `biologicalForm`,`fr`.`name` AS `fruit`,`fl`.`name` AS `flower`,`ab`.`name` AS `abundance`,`pc`.`name` AS `plantClassification` from (((((((((((`specimen` `s` left join `scientificname` `sn` on(((`sn`.`idSpecimen` = `s`.`idSpecimen`) and (`sn`.`isCurrent` = 1)))) left join `family` `f` on((`sn`.`idFamily` = `f`.`idFamily`))) left join `genus` `g` on((`sn`.`idGenus` = `g`.`idGenus`))) left join `species` `sp` on((`sn`.`idSpecies` = `sp`.`idSpecies`))) left join `vegetationtype` `vt` on((`s`.`idVegetationType` = `vt`.`idVegetationType`))) left join `soil` `so` on((`s`.`idSoil` = `so`.`idSoil`))) left join `biologicalform` `bf` on((`s`.`idBiologicalForm` = `bf`.`idBiologicalForm`))) left join `fruit` `fr` on((`s`.`idFruit` = `fr`.`idFruit`))) left join `flower` `fl` on((`s`.`idFlower` = `fl`.`idFlower`))) left join `abundance` `ab` on((`s`.`idAbundance` = `ab`.`idAbundance`))) left join `plantclassification` `pc` on((`s`.`idPlantClassification` = `pc`.`idPlantClassification`))) where (`s`.`protected` = 1) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vistaejemplardetalles`
--

/*!50001 DROP VIEW IF EXISTS `vistaejemplardetalles`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vistaejemplardetalles` AS select `s`.`idSpecimen` AS `idSpecimen`,`sn`.`name` AS `ScientificName`,`pc`.`name` AS `PlantClassification`,`a`.`name` AS `Abundance` from (((`specimen` `s` join `scientificname` `sn` on((`s`.`idSpecimen` = `sn`.`idSpecimen`))) join `plantclassification` `pc` on((`s`.`idPlantClassification` = `pc`.`idPlantClassification`))) join `abundance` `a` on((`s`.`idAbundance` = `a`.`idAbundance`))) where (`s`.`specimenState` = 1) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-09  4:47:43
