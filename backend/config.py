import pymysql

def get_connection():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='root',
        db='mainDB',
        autocommit=True,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
