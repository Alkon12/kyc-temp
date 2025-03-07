rs.status()

print('start migrations ~~~~')

db = db.getSiblingDB('uberAudit')
db.createUser({
  user: 'uberAudit',
  pwd: 'uberAudit',
  roles: [{ role: 'readWrite', db: 'uberAudit' }],
})
db.createCollection('systemAudit')

print('end ~~~~')
