CREATE DATABASE  IF NOT EXISTS `maindb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `maindb`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: maindb
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `attendance_date` date NOT NULL,
  `points` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,1,'2025-12-09',0,'2025-12-08 16:19:09');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_tb`
--

DROP TABLE IF EXISTS `comment_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_tb` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `body` text NOT NULL,
  `likes_count` int NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_tb`
--

LOCK TABLES `comment_tb` WRITE;
/*!40000 ALTER TABLE `comment_tb` DISABLE KEYS */;
INSERT INTO `comment_tb` VALUES (1,1,1,'첫 댓글입니다. 안녕하세요!',0,'2025-11-27 20:38:41');
/*!40000 ALTER TABLE `comment_tb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_score`
--

DROP TABLE IF EXISTS `game_score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_score` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `score` int NOT NULL,
  `game_type` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_score`
--

LOCK TABLES `game_score` WRITE;
/*!40000 ALTER TABLE `game_score` DISABLE KEYS */;
INSERT INTO `game_score` VALUES (2,1,300,'recycle','2025-12-08 16:10:28');
/*!40000 ALTER TABLE `game_score` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `point_history`
--

DROP TABLE IF EXISTS `point_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `point_history` (
  `point_history_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `amount` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`point_history_id`),
  KEY `fk_point_history_user` (`user_id`),
  CONSTRAINT `fk_point_history_user` FOREIGN KEY (`user_id`) REFERENCES `user_tb` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `point_history`
--

LOCK TABLES `point_history` WRITE;
/*!40000 ALTER TABLE `point_history` DISABLE KEYS */;
INSERT INTO `point_history` VALUES (2,1,300,'GAME','recycle 게임 포인트 지급','2025-12-09 01:10:28'),(3,1,10,'ATTENDANCE','출석체크 포인트 지급','2025-12-09 01:19:09');
/*!40000 ALTER TABLE `point_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_tb`
--

DROP TABLE IF EXISTS `post_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_tb` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `create_at` datetime NOT NULL,
  `update_at` datetime NOT NULL,
  `like_count` int DEFAULT '0',
  `view_count` int DEFAULT '0',
  `title` varchar(50) NOT NULL,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_tb`
--

LOCK TABLES `post_tb` WRITE;
/*!40000 ALTER TABLE `post_tb` DISABLE KEYS */;
INSERT INTO `post_tb` VALUES (1,1,'안녕하세요',' ','2025-11-27 20:34:39','2025-11-27 20:34:39',0,0,'안녕하세요');
/*!40000 ALTER TABLE `post_tb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_purchase`
--

DROP TABLE IF EXISTS `shop_purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_purchase` (
  `purchase_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `price` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`purchase_id`),
  KEY `fk_shop_purchase_user` (`user_id`),
  CONSTRAINT `fk_shop_purchase_user` FOREIGN KEY (`user_id`) REFERENCES `user_tb` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_purchase`
--

LOCK TABLES `shop_purchase` WRITE;
/*!40000 ALTER TABLE `shop_purchase` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_purchase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_reply_tb`
--

DROP TABLE IF EXISTS `support_reply_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_reply_tb` (
  `reply_id` int NOT NULL AUTO_INCREMENT,
  `support_ticket_id` int NOT NULL,
  `user_id` int NOT NULL,
  `body` varchar(250) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`reply_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_reply_tb`
--

LOCK TABLES `support_reply_tb` WRITE;
/*!40000 ALTER TABLE `support_reply_tb` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_reply_tb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_ticket_tb`
--

DROP TABLE IF EXISTS `support_ticket_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_ticket_tb` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `body` varchar(250) NOT NULL,
  `category` varchar(45) DEFAULT NULL,
  `status` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`ticket_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_ticket_tb`
--

LOCK TABLES `support_ticket_tb` WRITE;
/*!40000 ALTER TABLE `support_ticket_tb` DISABLE KEYS */;
INSERT INTO `support_ticket_tb` VALUES (1,1,'포스트맨 테스트','고객센터 기능이 잘 되는지 테스트 중입니다','기타','OPEN','2025-12-01 07:05:18','2025-12-01 07:05:18');
/*!40000 ALTER TABLE `support_ticket_tb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_tb`
--

DROP TABLE IF EXISTS `user_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_tb` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `point` int NOT NULL DEFAULT '0',
  `name` varchar(45) NOT NULL,
  `nickname` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `deleted_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tb`
--

LOCK TABLES `user_tb` WRITE;
/*!40000 ALTER TABLE `user_tb` DISABLE KEYS */;
INSERT INTO `user_tb` VALUES (1,'test@test.com','1234',310,'홍길동','길동이','010-1234-5678',NULL,'2025-11-09 00:43:39','9999-12-31 23:59:59'),(2,'test@tesst.com','$2b$12$TJ9XgWA73jCwkgjwNL6tqOxPoccAqBNliMJbBB8JhE1zQPELcfquG',0,'홍길동','길동이','010-1234-5678',NULL,'2025-11-09 01:00:08','9999-12-31 23:59:59'),(3,'test@tesst1.com','$2b$12$CTW8NBGd2iuEePi3belDYOb4Efb5s2uiFodrEW2hBb8.yoG3nu2Pa',0,'홍길동','길동이','010-1234-5678',NULL,'2025-11-09 01:08:49','9999-12-31 23:59:59');
/*!40000 ALTER TABLE `user_tb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'maindb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-09  1:23:05
