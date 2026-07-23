import sqlite3
conn = sqlite3.connect('netra_demo.db')
c = conn.cursor()
c.execute("UPDATE officers SET role = 'SUPER_ADMIN', rank = 'SUPER_ADMIN' WHERE badge_number = 'COMM-KA-0001'")
conn.commit()
conn.close()
print('Updated successfully')
