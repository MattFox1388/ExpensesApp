def delete_data_db(conn):
    cursor = conn.cursor()

    cursor.execute('''
        USE budget;
        ''')

    cursor.execute('''
            DELETE FROM `uncategorized_item`;
            ''')
    cursor.execute('''
        DELETE FROM `month_record`;
        ''')
    cursor.execute('''
        DELETE FROM `month_stat`;
        ''')
