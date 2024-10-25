
def initialize_db(conn):
    cursor = conn.cursor()

    cursor.execute('''
        CREATE DATABASE IF NOT EXISTS budget;
    ''')

    conn.commit()