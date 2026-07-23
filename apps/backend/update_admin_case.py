import sqlite3
import os

db_path = '../netra_demo.db'
if not os.path.exists(db_path):
    print("DB not found at", db_path)

conn = sqlite3.connect(db_path)
c = conn.cursor()
c.execute("UPDATE officers SET badge_number = 'ADMIN' WHERE badge_number = 'admin'")
conn.commit()
conn.close()
print('Updated successfully')
