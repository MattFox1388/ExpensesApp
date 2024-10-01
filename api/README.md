# Budget_API
Rest api to process and store budget data

db connection string:
db_uri="mysql+pymysql://username:pwd@serverhost:port/schema name"

## Create Pycharm Run Configuration:
- use python template
- parameters to use: run --port 8085
- environment vars: PYTHONUNBUFFERED=1;FLASK_APP=app.py;FLASK_ENV=development
- working directory: ...BudgetApi

## DB Script:
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema budget
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema budget
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `budget` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `budget` ;

-- -----------------------------------------------------
-- Table `budget`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `budget`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cat_type` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `budget`.`month`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `budget`.`month` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `month_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `budget`.`month_record`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `budget`.`month_record` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `month_id` INT NOT NULL,
  `cat_id` INT NULL DEFAULT NULL,
  `year_num` INT NOT NULL,
  `date_val` DATE NOT NULL,
  `amount` DOUBLE NOT NULL,
  `descr` VARCHAR(255) NOT NULL,
  `is_positive` TINYINT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_month` (`month_id` ASC) VISIBLE,
  INDEX `fk_cat` (`cat_id` ASC) VISIBLE,
  CONSTRAINT `fk_cat`
    FOREIGN KEY (`cat_id`)
    REFERENCES `budget`.`category` (`id`),
  CONSTRAINT `fk_month`
    FOREIGN KEY (`month_id`)
    REFERENCES `budget`.`month` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 23
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `budget`.`month_stat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `budget`.`month_stat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `month_id` INT NOT NULL,
  `year_num` INT NOT NULL,
  `date_val` DATE NOT NULL,
  `paycheck_planned` DOUBLE NULL DEFAULT NULL,
  `other_planned` DOUBLE NULL DEFAULT NULL,
  `expenses_planned` DOUBLE NULL DEFAULT NULL,
  `needs_planned` DOUBLE NULL DEFAULT NULL,
  `wants_planned` DOUBLE NULL DEFAULT NULL,
  `savings_planned` DOUBLE NULL DEFAULT NULL,
  `paycheck_actual` DOUBLE NULL DEFAULT NULL,
  `other_actual` DOUBLE NULL DEFAULT NULL,
  `expenses_actual` DOUBLE NULL DEFAULT NULL,
  `needs_actual` DOUBLE NULL DEFAULT NULL,
  `wants_actual` DOUBLE NULL DEFAULT NULL,
  `savings_actual` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_month_2` (`month_id` ASC) VISIBLE,
  CONSTRAINT `fk_month_2`
    FOREIGN KEY (`month_id`)
    REFERENCES `budget`.`month` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `budget`.`uncategorized_item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `budget`.`uncategorized_item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `month_record_id` INT NOT NULL,
  `is_want_or_expense` TINYINT(1) NOT NULL DEFAULT '0',
  `is_need_want_saving` TINYINT(1) NOT NULL DEFAULT '0',
  `is_should_be_ignored` TINYINT(1) NOT NULL DEFAULT '0',
  `is_expense_or_ignore` TINYINT(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `FK_MonthRecordUncategorizedItem` (`month_record_id` ASC) VISIBLE,
  CONSTRAINT `FK_MonthRecordUncategorizedItem`
    FOREIGN KEY (`month_record_id`)
    REFERENCES `budget`.`month_record` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS

## fill month table sql
INSERT INTO `month`  (month_name)
VALUES ('JAN'),
 ('FEB'),
 ('MAR'),
 ('APR'),
 ('MAY'),
 ('JUN'),
 ('JUL'),
 ('AUG'),
 ('SEP'),
 ('OCT'),
 ('NOV'),
 ('DEC');

## fill category table sql
insert into category (cat_type)
values ('NEEDS'),
('WANTS'),
('SAVINGS'),
('PAYCHECK'),
('INTEREST');