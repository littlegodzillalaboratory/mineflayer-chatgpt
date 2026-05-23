install-mineflayer-chatgpt:
	cd ../../../../../examples/ && \
		npm link && \
		cd ../ && \
		npm install && \
		npm link mineflayer-chatgpt

start-minecraft-server:
	docker compose -f ../../../../../test-integration/fixtures/docker-compose.yaml run -d minecraft_server

stop-minecraft-server:
	docker rm $$(docker stop $$(docker ps -a | grep itzg/minecraft-server | awk -v i="^$$1.*" '{if($$2~i){print$$1}}'))

get-minecraft-server-ip-address:
	@docker inspect -f '{{ .NetworkSettings.IPAddress}}' $$(docker ps -a | grep itzg/minecraft-server | awk -v i="^$$1.*" '{if($$2~i){print$$1}}')

.PHONY: install-mineflayer-chatgpt start-minecraft-server stop-minecraft-server get-minecraft-server-ip-address