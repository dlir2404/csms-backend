-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (arm64)
--
-- Host: 127.0.0.1    Database: csms-db
-- ------------------------------------------------------
-- Server version	8.4.2

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
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES (1,'FREEZE','2025-01-05 04:49:20','2025-01-05 04:49:20'),(4,'Cà phê phin','2025-01-05 05:11:54','2025-01-05 05:11:54'),(5,'Trà','2025-01-05 05:13:12','2025-01-05 05:13:12'),(6,'Phindi','2025-01-05 05:13:57','2025-01-05 05:13:57'),(7,'Expresso','2025-01-05 05:14:58','2025-01-05 05:14:58'),(8,'Bánh','2025-01-05 05:16:20','2025-01-05 05:16:20'),(9,'Bánh mì que','2025-01-05 05:23:46','2025-01-05 05:23:46');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `OrderProducts`
--

LOCK TABLES `OrderProducts` WRITE;
/*!40000 ALTER TABLE `OrderProducts` DISABLE KEYS */;
INSERT INTO `OrderProducts` VALUES (1,1,2,'2025-01-05 07:13:32','2025-01-05 07:13:32'),(1,2,2,'2025-01-05 07:13:32','2025-01-05 07:13:32'),(2,2,2,'2025-01-05 07:14:46','2025-01-05 07:14:46'),(2,3,3,'2025-01-05 07:14:46','2025-01-05 07:14:46'),(3,1,1,'2025-01-05 07:15:41','2025-01-05 07:15:41'),(3,4,1,'2025-01-05 07:15:41','2025-01-05 07:15:41'),(4,1,1,'2025-01-05 07:20:43','2025-01-05 07:20:43'),(4,4,1,'2025-01-05 07:20:43','2025-01-05 07:20:43'),(5,1,1,'2025-01-04 07:20:43','2025-01-05 07:20:43'),(5,4,1,'2025-01-04 07:20:43','2025-01-05 07:20:43'),(6,1,1,'2025-01-05 07:20:43','2025-01-05 07:20:43'),(6,4,1,'2025-01-05 07:20:43','2025-01-05 07:20:43'),(7,1,1,'2025-01-04 07:20:44','2025-01-05 07:20:44'),(7,4,1,'2025-01-04 07:20:44','2025-01-05 07:20:44'),(8,1,1,'2025-01-05 07:23:26','2025-01-05 07:23:26'),(8,4,1,'2025-01-05 07:23:26','2025-01-05 07:23:26'),(9,4,1,'2025-01-05 07:28:29','2025-01-05 07:28:29'),(9,8,1,'2025-01-05 07:28:29','2025-01-05 07:28:29'),(10,1,1,'2025-01-05 07:28:54','2025-01-05 07:28:54'),(10,7,1,'2025-01-05 07:28:54','2025-01-05 07:28:54'),(11,1,1,'2025-01-05 09:28:03','2025-01-05 09:28:03'),(11,7,1,'2025-01-05 09:28:03','2025-01-05 09:28:03');
/*!40000 ALTER TABLE `OrderProducts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` VALUES (1,220000.00,'','processing',3,2,'2025-01-05 07:13:32','2025-01-05 08:16:17'),(2,275000.00,'','processing',3,6,'2025-01-05 07:14:46','2025-01-05 09:30:25'),(3,110000.00,'','completed',3,NULL,'2025-01-05 07:15:41','2025-01-05 09:31:28'),(4,110000.00,'','completed',3,NULL,'2025-01-05 07:20:43','2025-01-05 09:31:34'),(5,110000.00,'','created',3,NULL,'2025-01-04 07:20:43','2025-01-04 07:20:43'),(6,110000.00,'','created',3,NULL,'2025-01-05 07:20:43','2025-01-05 07:20:43'),(7,110000.00,'','created',3,NULL,'2025-01-04 07:20:44','2025-01-04 07:20:44'),(8,110000.00,'','created',3,NULL,'2025-01-05 07:23:26','2025-01-05 07:23:26'),(9,100000.00,'','created',3,NULL,'2025-01-05 07:28:29','2025-01-05 07:28:29'),(10,100000.00,'','created',3,NULL,'2025-01-05 07:28:54','2025-01-05 07:28:54'),(11,100000.00,'','created',5,NULL,'2025-01-05 09:28:03','2025-01-05 09:28:03');
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Payments`
--

LOCK TABLES `Payments` WRITE;
/*!40000 ALTER TABLE `Payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `Payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ProductCategories`
--

LOCK TABLES `ProductCategories` WRITE;
/*!40000 ALTER TABLE `ProductCategories` DISABLE KEYS */;
INSERT INTO `ProductCategories` VALUES (1,1,'2025-01-05 04:49:26','2025-01-05 04:49:26'),(2,1,'2025-01-05 04:49:31','2025-01-05 04:49:31'),(3,1,'2025-01-05 04:50:42','2025-01-05 04:50:42'),(4,1,'2025-01-05 04:51:54','2025-01-05 04:51:54'),(5,1,'2025-01-05 04:53:24','2025-01-05 04:53:24'),(6,6,'2025-01-05 05:14:15','2025-01-05 05:14:15'),(7,6,'2025-01-05 05:14:21','2025-01-05 05:14:21'),(8,6,'2025-01-05 05:14:27','2025-01-05 05:14:27'),(9,6,'2025-01-05 05:14:34','2025-01-05 05:14:34'),(10,4,'2025-01-05 05:12:49','2025-01-05 05:12:49'),(11,7,'2025-01-05 05:15:46','2025-01-05 05:15:46'),(12,7,'2025-01-05 05:15:43','2025-01-05 05:15:43'),(13,7,'2025-01-05 05:15:51','2025-01-05 05:15:51'),(14,7,'2025-01-05 05:15:32','2025-01-05 05:15:32'),(15,7,'2025-01-05 05:15:26','2025-01-05 05:15:26'),(16,7,'2025-01-05 05:15:11','2025-01-05 05:15:11'),(17,4,'2025-01-05 05:12:11','2025-01-05 05:12:11'),(18,4,'2025-01-05 05:12:16','2025-01-05 05:12:16'),(19,4,'2025-01-05 05:12:20','2025-01-05 05:12:20'),(20,4,'2025-01-05 05:12:31','2025-01-05 05:12:31'),(21,5,'2025-01-05 05:13:21','2025-01-05 05:13:21'),(22,5,'2025-01-05 05:13:24','2025-01-05 05:13:24'),(23,5,'2025-01-05 05:13:28','2025-01-05 05:13:28'),(24,5,'2025-01-05 05:13:32','2025-01-05 05:13:32'),(25,5,'2025-01-05 05:13:36','2025-01-05 05:13:36'),(26,8,'2025-01-05 05:17:07','2025-01-05 05:17:07'),(27,8,'2025-01-05 05:18:00','2025-01-05 05:18:00'),(28,8,'2025-01-05 05:18:36','2025-01-05 05:18:36'),(29,8,'2025-01-05 05:19:14','2025-01-05 05:19:14'),(30,8,'2025-01-05 05:20:15','2025-01-05 05:20:15'),(31,8,'2025-01-05 05:22:37','2025-01-05 05:22:37'),(32,8,'2025-01-05 05:23:13','2025-01-05 05:23:13'),(33,9,'2025-01-05 05:24:48','2025-01-05 05:24:48'),(34,9,'2025-01-05 05:25:36','2025-01-05 05:25:36');
/*!40000 ALTER TABLE `ProductCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
INSERT INTO `Products` VALUES (1,'Freeze Trà Xanh',55000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736052466/dujzs6bbvr6dji5qcqih.jpg',1,'2025-01-05 04:47:46','2025-01-05 04:47:46'),(2,'Cookies & Cream',55000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736052544/cfqthc0e4qm9ahqbzmxh.jpg',1,'2025-01-05 04:49:05','2025-01-05 04:49:05'),(3,'Freeze Sô-cô-la',55000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736052641/qvc69tg4whlkuqjbqqi3.jpg',1,'2025-01-05 04:50:42','2025-01-05 04:50:42'),(4,'Caramel Phin Freeze',55000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736052714/fnd0fl8x1cyrdudpi5wt.jpg',1,'2025-01-05 04:51:54','2025-01-05 04:51:54'),(5,'Classic Phin Freeze',55000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736052804/m6ibg2bloxzoast1fgxv.jpg',1,'2025-01-05 04:53:24','2025-01-05 04:53:24'),(6,'PhinDi Cassia',55000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736052930/d4mjxcqs4k3zggxpylw9.jpg',1,'2025-01-05 04:55:30','2025-01-05 04:55:30'),(7,'PhinDi Choco',45000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736052986/t0elmhimtxbjd2mjmfrm.jpg',1,'2025-01-05 04:56:27','2025-01-05 04:56:27'),(8,'PhinDi Hạnh Nhân',45000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053032/vxejmuhskgrnak3ltqzv.jpg',1,'2025-01-05 04:57:12','2025-01-05 04:57:12'),(9,'PhinDi Kem Sữa',45000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053101/i4cigg6mnayumzltmt41.jpg',1,'2025-01-05 04:58:22','2025-01-05 04:58:22'),(10,'Bạc Xỉu Đá',29000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053143/kqvydzbtizbcy9g6bqgn.jpg',1,'2025-01-05 04:59:03','2025-01-05 04:59:03'),(11,'Caramel Macchiato',69000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053183/oclhwzpzto3eglbacnhz.jpg',1,'2025-01-05 04:59:44','2025-01-05 04:59:44'),(12,'Mocha Macchiato',69000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053222/icqbwosc3wyrqim5grhc.jpg',1,'2025-01-05 05:00:23','2025-01-05 05:00:23'),(13,'Latte',65000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053282/vwcp2efoihnkhcqnsm1a.jpg',1,'2025-01-05 05:01:23','2025-01-05 05:01:23'),(14,'Cappuccino',65000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053322/cz0cnbrivlcfohvbxii6.jpg',1,'2025-01-05 05:02:03','2025-01-05 05:02:03'),(15,'Americano',45000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053354/pnciwzwesofil3laeo8y.jpg',1,'2025-01-05 05:02:34','2025-01-05 05:02:34'),(16,'Espresso',45000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053387/k560oavrzygbbtyj3ohs.jpg',1,'2025-01-05 05:03:08','2025-01-05 05:03:08'),(17,'Phin Sữa Đá',29000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053420/frnyfrjh9fxruakytu2k.jpg',1,'2025-01-05 05:03:40','2025-01-05 05:03:40'),(18,'Phin Đen Đá',29000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053450/pxymywxtboyvb9ftqhya.jpg',1,'2025-01-05 05:04:10','2025-01-05 05:04:10'),(19,'Phin Đen Nóng',29000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053483/tsmeepmpu6ck4uy74z92.jpg',1,'2025-01-05 05:04:43','2025-01-05 05:04:43'),(20,'Phin Sữa Nóng',29000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053516/v2mmuuc5z7lzfftd9til.jpg',1,'2025-01-05 05:05:17','2025-01-05 05:05:17'),(21,'Trà Sen Vàng (Củ Năng)',45000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053620/ak27hipwppg4mjbjdd0p.jpg',1,'2025-01-05 05:07:01','2025-01-05 05:07:01'),(22,'Trà Sen Vàng (Sen)',45000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053651/kgcyq4wafwae5tjiipjw.jpg',1,'2025-01-05 05:07:32','2025-01-05 05:07:32'),(23,'Trà Xanh Đậu Đỏ',45000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053684/rqjao2qn3dgxsg8ghewp.jpg',1,'2025-01-05 05:08:05','2025-01-05 05:08:05'),(24,'Trà Thạch Vải',45000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053716/ikgnbziouls4ntl4tven.jpg',1,'2025-01-05 05:08:39','2025-01-05 05:08:39'),(25,'Trà Thạch Đào',45000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736053750/iovbeg7zsykqzsv7ozbw.jpg',1,'2025-01-05 05:09:10','2025-01-05 05:09:10'),(26,'Bánh chuối',29000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736054227/b8sphjfvz7gnnoqjox1w.webp',1,'2025-01-05 05:17:07','2025-01-05 05:17:07'),(27,'Phô mai chanh dây',29000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736054280/hqro0aebgb1wdbrszryn.jpg',1,'2025-01-05 05:18:00','2025-01-05 05:18:00'),(28,'Phô mai cà phê',29000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736054316/rvv2gqzyuzg6pwubjosg.jpg',1,'2025-01-05 05:18:36','2025-01-05 05:18:36'),(29,'Tiramisu',35000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736054354/qenecm70cyidlowvutr4.png',1,'2025-01-05 05:19:14','2025-01-05 05:19:14'),(30,'Bánh Mousse đào',35000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736054414/ir6yxsqvlkapbiwqtnl7.webp',1,'2025-01-05 05:20:15','2025-01-05 05:20:15'),(31,'Phô mai trà xanh',35000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736054556/d7ciryjiw4j9ajpz0gwo.webp',1,'2025-01-05 05:22:37','2025-01-05 05:22:37'),(32,'Phô mai caramel',35000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736054592/aitezmgdzt4xyeuae0us.jpg',1,'2025-01-05 05:23:13','2025-01-05 05:23:13'),(33,'Bánh mì que pate',19000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736054688/j9k6nhmgvmcm84klkluw.webp',1,'2025-01-05 05:24:48','2025-01-05 05:24:48'),(34,'Bánh mì que gà phô mai',19000,'https://res.cloudinary.com/dd0fae9zz/image/upload/v1736054736/haub1xmbtadazvb8ir0y.webp',1,'2025-01-05 05:25:36','2025-01-05 05:25:36');
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'manager','manager','$2b$10$jBfkATO4y71jBpObVDM2iuvYosVkxmZUxS0srHkyiR3uEp4wAFXXS','manager','2024-12-18 16:55:06','2024-12-18 16:55:06'),(2,'barista','Đình Linh','$2b$10$W1BWMptDlHU4QfKontRMkuflzWe4NZfIXutGwwpm17.wBKPesfL8u','barista','2025-01-05 07:06:43','2025-01-05 09:28:55'),(3,'order_taker','Nguyễn Khánh Vinh','$2b$10$tnzliim/kqbxueJlQ6kRj.O7N8K11mRrdIp8pukV3jf5eg2NHgeTC','order_taker','2025-01-05 07:07:07','2025-01-05 09:28:21'),(4,'order_taker_2','Nguyễn Văn A','$2b$10$qJ0.b1ut90m9NbmQ2XepNeFiqzqag.7gdfj/lguPdhQOb1itveOFu','order_taker','2025-01-05 09:25:11','2025-01-05 09:25:11'),(5,'order_taker_3','Đỗ Tuấn Thịnh','$2b$10$fGt6q1U5YWstZfyAZuvZH.O4OPHbEMCEBDmNyRDmHgCmW1SObmGZi','order_taker','2025-01-05 09:27:35','2025-01-05 09:27:35'),(6,'barista_2','Hoàng Anh','$2b$10$qzkJVRj29LpnbPhtUZGYOO6H8w1BnSS.SnB25Zrnok6VUVKghTHmG','barista','2025-01-05 09:29:22','2025-01-05 09:29:22');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-05 16:40:58
