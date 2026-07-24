import sqlite3
import bcrypt
import uuid

valid_demo_hash = bcrypt.hashpw(b"Demo@2026!", bcrypt.gensalt()).decode("utf-8")
valid_admin_hash = bcrypt.hashpw(b"admin", bcrypt.gensalt()).decode("utf-8")
valid_pass123_hash = bcrypt.hashpw(b"password123", bcrypt.gensalt()).decode("utf-8")

conn = sqlite3.connect("c:/Projects/KSP/netra_demo.db")
cur = conn.cursor()

# Update all existing demo officers to have valid hash for Demo@2026!
cur.execute("UPDATE officers SET password_hash = ?", (valid_demo_hash,))

# Ensure admin user exists with password 'admin'
cur.execute("SELECT station_id, district_id FROM officers LIMIT 1")
row = cur.fetchone()
if row:
    stat_id, dist_id = row[0], row[1]
    cur.execute("UPDATE officers SET password_hash = ? WHERE lower(badge_number) = 'admin'", (valid_admin_hash,))
    # Ensure ADMIN (uppercase) also exists
    cur.execute("SELECT badge_number FROM officers WHERE badge_number = 'ADMIN'")
    if not cur.fetchone():
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc).isoformat()
        cur.execute("""
            INSERT INTO officers (id, badge_number, name, email, role, rank, password_hash, station_id, district_id, mfa_enabled, is_active, created_at, updated_at)
            VALUES (?, 'ADMIN', 'System Admin', 'admin.system@ksp.gov.in', 'SUPER_ADMIN', 'SUPER_ADMIN', ?, ?, ?, 0, 1, ?, ?)
        """, (str(uuid.uuid4()), valid_admin_hash, stat_id, dist_id, now, now))
    else:
        cur.execute("UPDATE officers SET password_hash = ? WHERE badge_number = 'ADMIN'", (valid_admin_hash,))

# Also ensure INSP-BLR-0001 works with password123 as well as Demo@2026!
# We set INSP-BLR-0001 password to Demo@2026! for consistency

conn.commit()
conn.close()
print("Successfully updated officer password hashes in netra_demo.db!")
