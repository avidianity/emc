/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET NAMES utf8 */
;
/*!50503 SET NAMES utf8mb4 */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;
-- Dumping structure for table emc.admission
DROP TABLE IF EXISTS `admission`;
CREATE TABLE IF NOT EXISTS `admission` (
	`id` bigint unsigned NOT NULL AUTO_INCREMENT,
	`course_code` varchar(255) NOT NULL,
	`level` varchar(255) NOT NULL,
	`status` varchar(255) NOT NULL,
	`term` varchar(255) NOT NULL,
	`graduated` smallint NOT NULL DEFAULT '0',
	`user_id` bigint unsigned NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `user_id` (`user_id`),
	CONSTRAINT `FK_admission_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
-- Dumping data for table emc.admission: ~0 rows (approximately)
/*!40000 ALTER TABLE `admission` DISABLE KEYS */
;
/*!40000 ALTER TABLE `admission` ENABLE KEYS */
;
-- Dumping structure for table emc.course
DROP TABLE IF EXISTS `course`;
CREATE TABLE IF NOT EXISTS `course` (
	`id` bigint unsigned NOT NULL AUTO_INCREMENT,
	`code` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`open` tinyint(1) NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `code` (`code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
-- Dumping data for table emc.course: ~0 rows (approximately)
/*!40000 ALTER TABLE `course` DISABLE KEYS */
;
/*!40000 ALTER TABLE `course` ENABLE KEYS */
;
-- Dumping structure for table emc.grade
DROP TABLE IF EXISTS `grade`;
CREATE TABLE IF NOT EXISTS `grade` (
	`id` bigint unsigned NOT NULL AUTO_INCREMENT,
	`student_id` bigint unsigned NOT NULL,
	`subject_id` bigint unsigned NOT NULL,
	`teacher_id` bigint unsigned NOT NULL,
	`grade` tinyint NOT NULL DEFAULT '65',
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `student_id` (`student_id`),
	KEY `subject_id` (`subject_id`),
	KEY `teacher_id` (`teacher_id`),
	CONSTRAINT `FK_grade_subject` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`),
	CONSTRAINT `FK_grade_user` FOREIGN KEY (`student_id`) REFERENCES `user` (`id`),
	CONSTRAINT `FK_grade_user_2` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
-- Dumping data for table emc.grade: ~0 rows (approximately)
/*!40000 ALTER TABLE `grade` DISABLE KEYS */
;
/*!40000 ALTER TABLE `grade` ENABLE KEYS */
;
-- Dumping structure for table emc.mail
DROP TABLE IF EXISTS `mail`;
CREATE TABLE IF NOT EXISTS `mail` (
	`id` bigint unsigned NOT NULL AUTO_INCREMENT,
	`uuid` varchar(255) NOT NULL,
	`to` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`status` varchar(255) NOT NULL,
	`sent` varchar(255) DEFAULT NULL,
	`body` text NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
-- Dumping data for table emc.mail: ~0 rows (approximately)
/*!40000 ALTER TABLE `mail` DISABLE KEYS */
;
/*!40000 ALTER TABLE `mail` ENABLE KEYS */
;
-- Dumping structure for table emc.queue
DROP TABLE IF EXISTS `queue`;
CREATE TABLE IF NOT EXISTS `queue` (
	`id` bigint unsigned NOT NULL AUTO_INCREMENT,
	`payload` text NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
-- Dumping data for table emc.queue: ~0 rows (approximately)
/*!40000 ALTER TABLE `queue` DISABLE KEYS */
;
/*!40000 ALTER TABLE `queue` ENABLE KEYS */
;
-- Dumping structure for table emc.schedule
DROP TABLE IF EXISTS `schedule`;
CREATE TABLE IF NOT EXISTS `schedule` (
	`id` bigint unsigned NOT NULL AUTO_INCREMENT,
	`course_id` bigint unsigned NOT NULL,
	`teacher_id` bigint unsigned NOT NULL,
	`subject_id` bigint unsigned NOT NULL,
	`year` varchar(255) NOT NULL,
	`payload` text NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `course_id` (`course_id`),
	KEY `user_id` (`teacher_id`) USING BTREE,
	KEY `subject_id` (`subject_id`),
	CONSTRAINT `FK_schedule_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
	CONSTRAINT `FK_schedule_subject` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`),
	CONSTRAINT `FK_schedule_user` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
-- Dumping data for table emc.schedule: ~0 rows (approximately)
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */
;
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */
;
-- Dumping structure for table emc.session
DROP TABLE IF EXISTS `session`;
CREATE TABLE IF NOT EXISTS `session` (
	`id` varchar(255) NOT NULL,
	`payload` text NOT NULL,
	`last_activity` bigint unsigned NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
-- Dumping data for table emc.session: ~0 rows (approximately)
/*!40000 ALTER TABLE `session` DISABLE KEYS */
;
/*!40000 ALTER TABLE `session` ENABLE KEYS */
;
-- Dumping structure for table emc.student_subject
DROP TABLE IF EXISTS `student_subject`;
CREATE TABLE IF NOT EXISTS `student_subject` (
	`id` bigint unsigned NOT NULL AUTO_INCREMENT,
	`subject_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `FK_student_subject_subject` (`subject_id`),
	KEY `FK_student_subject_user` (`user_id`),
	CONSTRAINT `FK_student_subject_subject` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`),
	CONSTRAINT `FK_student_subject_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
-- Dumping data for table emc.student_subject: ~0 rows (approximately)
/*!40000 ALTER TABLE `student_subject` DISABLE KEYS */
;
/*!40000 ALTER TABLE `student_subject` ENABLE KEYS */
;
-- Dumping structure for table emc.subject
DROP TABLE IF EXISTS `subject`;
CREATE TABLE IF NOT EXISTS `subject` (
	`id` bigint unsigned NOT NULL AUTO_INCREMENT,
	`code` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`course_code` varchar(255) NOT NULL,
	`level` varchar(255) NOT NULL,
	`term` varchar(255) NOT NULL,
	`units` varchar(255) NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `course_code` (`course_code`),
	CONSTRAINT `FK_subject_course` FOREIGN KEY (`course_code`) REFERENCES `course` (`code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
-- Dumping data for table emc.subject: ~0 rows (approximately)
/*!40000 ALTER TABLE `subject` DISABLE KEYS */
;
/*!40000 ALTER TABLE `subject` ENABLE KEYS */
;
-- Dumping structure for table emc.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
	`id` bigint unsigned NOT NULL AUTO_INCREMENT,
	`uuid` varchar(255) NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`middle_name` varchar(255) DEFAULT NULL,
	`gender` varchar(255) DEFAULT NULL,
	`address` varchar(255) DEFAULT NULL,
	`place_of_birth` varchar(255) DEFAULT NULL,
	`birthday` varchar(255) DEFAULT NULL,
	`role` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`number` varchar(255) NOT NULL,
	`active` tinyint(1) NOT NULL,
	`password` varchar(255) NOT NULL,
	`password_unsafe` varchar(255) NOT NULL,
	`fathers_name` varchar(255) DEFAULT NULL,
	`mothers_name` varchar(255) DEFAULT NULL,
	`fathers_occupation` varchar(255) DEFAULT NULL,
	`mothers_occupation` varchar(255) DEFAULT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
-- Dumping data for table emc.user: ~1 rows (approximately)
/*!40000 ALTER TABLE `user` DISABLE KEYS */
;
INSERT INTO `user` (
		`id`,
		`uuid`,
		`first_name`,
		`last_name`,
		`middle_name`,
		`gender`,
		`address`,
		`place_of_birth`,
		`birthday`,
		`role`,
		`email`,
		`number`,
		`active`,
		`password`,
		`password_unsafe`,
		`fathers_name`,
		`mothers_name`,
		`fathers_occupation`,
		`mothers_occupation`,
		`created_at`,
		`updated_at`
	)
VALUES (
		4,
		'fMsRtGUunk',
		'admin',
		'admin',
		NULL,
		NULL,
		NULL,
		NULL,
		NULL,
		'Admin',
		'admin@gmail.com',
		'09123456789',
		1,
		'$2y$10$5f1eyQFsDTzd3izG/QN7e.pmVANrdAZdTX8endkYDvS6t.TR4Qg6O',
		'admin',
		NULL,
		NULL,
		NULL,
		NULL,
		'2021-05-08 21:41:24',
		'2021-05-08 21:41:24'
	);
/*!40000 ALTER TABLE `user` ENABLE KEYS */
;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */
;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */
;