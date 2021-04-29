CREATE TABLE IF NOT EXISTS `admission` (
	`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`course_code` varchar(255) NOT NULL,
	`level` varchar(255) NOT NULL,
	`status` varchar(255) NOT NULL,
	`term` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`graduated` smallint(1) NOT NULL DEFAULT 0,
	`user_id` bigint(20) unsigned NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `user_id` (`user_id`)
);
CREATE TABLE IF NOT EXISTS `course` (
	`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`code` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`open` tinyint(1) NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `grade` (
	`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`student_id` bigint(20) unsigned NOT NULL,
	`subject_id` bigint(20) unsigned NOT NULL,
	`teacher_id` bigint(20) unsigned NOT NULL,
	`grade` varchar(255) NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `student_id` (`student_id`),
	KEY `subject_id` (`subject_id`),
	KEY `teacher_id` (`teacher_id`)
);
CREATE TABLE IF NOT EXISTS `mail` (
	`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`uuid` varchar(255) NOT NULL,
	`to` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`status` varchar(255) NOT NULL,
	`sent` varchar(255) DEFAULT NULL,
	`body` text NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `queue` (
	`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`payload` text NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `schedule` (
	`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`course_id` bigint(20) unsigned NOT NULL,
	`teacher_id` bigint(20) unsigned NOT NULL,
	`year` varchar(255) NOT NULL,
	`payload` text NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `course_id` (`course_id`),
	KEY `user_id` (`teacher_id`) USING BTREE
);
CREATE TABLE IF NOT EXISTS `session` (
	`id` varchar(255) NOT NULL,
	`payload` text NOT NULL,
	`last_activity` bigint(20) unsigned NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `subject` (
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
	`code` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`course_code` varchar(255) NOT NULL,
	`level` varchar(255) NOT NULL,
	`term` varchar(255) NOT NULL,
	`units` varchar(255) NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `course_code` (`course_code`)
);
CREATE TABLE IF NOT EXISTS `user` (
	`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`uuid` varchar(255) NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`middle_name` varchar(255) DEFAULT NULL,
	`gender` varchar(255) DEFAULT NULL,
	`address` varchar(255) DEFAULT NULL,
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
);