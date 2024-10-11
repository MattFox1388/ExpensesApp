
def initialize_db(conn):
    cursor = conn.cursor()

    cursor.execute('''
        CREATE DATABASE IF NOT EXISTS budget;
    ''')

    cursor.execute('''
    USE budget;
    ''')

    cursor.execute('''
    DROP TABLE IF EXISTS `uncategorized_item`
    ''')

    cursor.execute('''
        DROP TABLE IF EXISTS `month_record`
        ''')

    cursor.execute('''
        DROP TABLE IF EXISTS `month_stat`
        ''')

    cursor.execute('''
        DROP TABLE IF EXISTS `month`
        ''')

    cursor.execute('''
        DROP TABLE IF EXISTS `category`;
        ''')

    cursor.execute('''
    DROP TABLE IF EXISTS `user`
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS `category` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    `cat_type` TEXT NOT NULL)
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS `month` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `month_name` TEXT NOT NULL)
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS `month_record` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `month_id` INT NOT NULL,
  `cat_id` INT NULL DEFAULT NULL,
  `year_num` INT NOT NULL,
  `date_val` TEXT NOT NULL,
  `amount` REAL NOT NULL,
  `descr` TEXT NOT NULL,
  `is_positive` BOOLEAN NOT NULL DEFAULT 0,
  CHECK (`is_positive` IN (0, 1)),
  CONSTRAINT fk_category FOREIGN KEY (`cat_id`) REFERENCES `category` (`id`),
  CONSTRAINT fk_month FOREIGN KEY (`month_id`) REFERENCES `month` (`id`))
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS `month_stat` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `month_id` INT NOT NULL,
  `year_num` INT NOT NULL,
  `date_val` TEXT NOT NULL,
  `paycheck_planned` REAL NULL DEFAULT NULL,
  `other_planned` REAL  NULL DEFAULT NULL,
  `expenses_planned` REAL  NULL DEFAULT NULL,
  `needs_planned` REAL  NULL DEFAULT NULL,
  `wants_planned` REAL  NULL DEFAULT NULL,
  `savings_planned` REAL  NULL DEFAULT NULL,
  `paycheck_actual` REAL  NULL DEFAULT NULL,
  `other_actual` REAL  NULL DEFAULT NULL,
  `expenses_actual` REAL  NULL DEFAULT NULL,
  `needs_actual` REAL  NULL DEFAULT NULL,
  `wants_actual` REAL  NULL DEFAULT NULL,
  `savings_actual` REAL  NULL DEFAULT NULL,
  CONSTRAINT fk_month_2 FOREIGN KEY (`month_id`) REFERENCES `month` (`id`))
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS `uncategorized_item` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `month_record_id` INT NOT NULL,
  `is_want_or_expense` INT NOT NULL DEFAULT 0,
  `is_need_want_saving` INT NOT NULL DEFAULT 0,
  `is_should_be_ignored` INT NOT NULL DEFAULT 0,
  `is_expense_or_ignore` INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_month_record FOREIGN KEY (`month_record_id`) REFERENCES `month_record` (`id`))
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS `user` (
        `id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
      `username` TEXT NOT NULL,
      `password_hash` TEXT NOT NULL)
        ''')

    cursor.execute('''
    INSERT INTO `user` (username, password_hash)
    VALUES ('kazou1388', '$6$rounds=656000$gGRjoZcVeBd9YpQi$rV6WQQfLXPOWPGNDAM7naLXDfdx7FU/kcxv3d39xhmyHtCYyc5U783iRZFTPASzzDFT9JFUABq/gRLHzdfs5l.')
    ''')

    cursor.execute('''
    INSERT INTO `month` (month_name)
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
    ''')

    cursor.execute('''
    insert into category (cat_type)
values ('NEEDS'),
('WANTS'),
('SAVINGS'),
('PAYCHECK'),
('INTEREST');
    ''')


    conn.commit()