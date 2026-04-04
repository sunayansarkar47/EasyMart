import mysql.connector

try:
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Sunayan47#",
    )
    if connection.is_connected():
        print("Connected successfully!")
        connection.close()
except mysql.connector.Error as e:
    print(f"Error: {e}")