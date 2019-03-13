import os

arr =   ["sudo apt-get update", "sudo apt-get install -y mongodb-org","sudo ufw enable",
			"sudo systemctl start mongod", "sudo systemctl status mongod"
			"sudo systemctl enable mongod", "sudo ufw allow from 130.245.170.60/32 to any port 27017", 
			"sudo ufw status"
		]

for i in arr:
	os.system(i);