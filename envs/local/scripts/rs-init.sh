#!/bin/bash

DELAY=25

echo "****** Starting replica ******"

mongosh <<EOF
var config = {
    "_id": "dbrs",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "uberAudit1:27017",
            "priority": 2
        },
        {
            "_id": 2,
            "host": "uberAudit2:27017",
            "priority": 1
        },
        {
            "_id": 3,
            "host": "uberAudit3:27017",
            "priority": 1
        }
    ]
};
rs.initiate(config, { force: true });
EOF

echo "****** Waiting for ${DELAY} seconds for replicaset configuration to be applied ******"

sleep $DELAY

mongosh < /scripts/init.js


sleep 5

docker-compose --file docker-compose.yml logs -f