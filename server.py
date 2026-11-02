from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import smtplib
from email.mime.text import MIMEText
import sqlite3

# НАСТРОЙКИ ПОЧТЫ
GMAIL_USER = 'deccore88@gmail.com'
GMAIL_APP_PASSWORD = 'ixvbwyutqaximlvq' 

class RequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        # 1. СОХРАНЕНИЕ В БАЗУ ДАННЫХ SQLITE
        try:
            conn = sqlite3.connect('database.db')
            cursor = conn.cursor()
            cursor.execute('''CREATE TABLE IF NOT EXISTS applications
                              (id INTEGER PRIMARY KEY AUTOINCREMENT,
                               name TEXT,
                               contact TEXT,
                               message TEXT,
                               date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
            cursor.execute("INSERT INTO applications (name, contact, message) VALUES (?, ?, ?)",
                           (data['name'], data['email'], data['message']))
            conn.commit()
            conn.close()
            print("✅ ЗАЯВКА СОХРАНЕНА В БАЗУ ДАННЫХ")
        except Exception as e:
            print(f"❌ ОШИБКА БАЗЫ ДАННЫХ: {e}")

        # 2. ОТПРАВКА НА ПОЧТУ
        text = f"🔥 Новая заявка с сайта!\n\n👤 Имя: {data['name']}\n📞 Контакт: {data['email']}\n📝 Задача: {data['message']}"
        
        try:
            msg = MIMEText(text, 'plain', 'utf-8')
            msg['Subject'] = 'Новая заявка с сайта HollowCore'
            msg['From'] = GMAIL_USER
            msg['To'] = GMAIL_USER

            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
                server.send_message(msg)
            
            print("✅ ПИСЬМО ОТПРАВЛЕНО НА ПОЧТУ")
            res_data = {'status': 'ok'}
        except Exception as e:
            print(f"❌ ОШИБКА ПОЧТЫ: {e}")
            res_data = {'status': 'error'}

        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(res_data).encode('utf-8'))

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8000), RequestHandler)
    print("Сервер запущен. Ждем заявок...")
    server.serve_forever()