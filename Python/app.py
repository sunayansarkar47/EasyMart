from flask import Flask, request, render_template, redirect
import psycopg2

app = Flask(__name__)

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="easymart",
        user="your_username", 
        password="your_password"  
    )

@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    phone = request.form['phone']
    password = request.form['password']
    confirm_password = request.form['confirm_password']

    if password != confirm_password:
        return "Passwords do not match!", 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO customer (username, phone, password) VALUES (%s, %s, %s)",
        (username, phone, password) 
    )

    conn.commit()
    cursor.close()
    conn.close()

    return "Registration successful!", 200

if __name__ == '__main__':
    app.run(debug=True)