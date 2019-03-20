
import os

arr=[
	'sudo apt-get update', 'sudo apt-get install -y nodejs',	
	'sudo apt-get install -y npm', 'curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh',
	'sudo bash nodesource_setup.sh', 'sudo apt-get install -y nodejs', 'sudo apt-get install -y build-essential',
	'sudo npm install -y -g pm2', 'sudo ufw allow OpenSSH'
	]

for i in arr:
	os.system(i)