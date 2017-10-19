USER_ID := $(shell id -u ${USER})

COMPOSE=USER=${USER} USER_ID=$(USER_ID) docker-compose -f docker-compose.development.yml

build:
	$(COMPOSE) stop
	$(COMPOSE) rm -vf
	$(COMPOSE) build
	$(COMPOSE) up -d
stop:
	$(COMPOSE) stop
rm:
	yes | $(COMPOSE) rm
delete:
	docker rmi $(IMAGE_TAG)
ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs

.PHONY: clean build
