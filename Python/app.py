from flask import Flask, render_template, request
from db_connect import get_connection

app = Flask(__name__)

# 👉 Customer Registration
@app.route('/register_customer', methods=['POST'])
def register_customer():
    username = request.form['username']
    phone = request.form['phone']
    password = request.form['password']

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO Customer (username, phone_number, password) VALUES (%s, %s, %s)",
        (username, phone, password)
    )

    conn.commit()
    conn.close()

    return "Customer Registered Successfully ✅"


# 👉 Shopkeeper Registration
@app.route('/register_shopkeeper', methods=['POST'])
def register_shopkeeper():
    username = request.form['username']
    phone = request.form['phone']
    shop_name = request.form['shop_name']
    location = request.form['location']
    shop_type = request.form['shop_type']
    password = request.form['password']

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """INSERT INTO Shopkeeper 
        (username, phone_number, shop_name, location, shop_type, password) 
        VALUES (%s, %s, %s, %s, %s, %s)""",
        (username, phone, shop_name, location, shop_type, password)
    )

    conn.commit()
    conn.close()

    return "Shopkeeper Registered Successfully ✅"


if __name__ == "__main__":
    app.run(debug=True)