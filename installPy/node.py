
import os

arr=[
	'sudo apt-get update', 'sudo apt-get install nodejs',	
	'sudo apt-get install npm', 'curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh',
	'sudo bash nodesource_setup.sh', 'sudo apt-get install nodejs', 'sudo apt-get install build-essential',
	'sudo npm install -g pm2'
	]

for i in arr:
	os.system(i)