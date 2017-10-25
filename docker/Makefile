USER_ID := $(shell id -u ${USER})
DOCKER_REGISTRY?=localhost:5000
TAG?=latest
PROJECT?=prontopiso/frontend
API_PROJECT_NAME?=prontopiso/api
API_PROJECT_IMAGE=$(DOCKER_REGISTRY)/$(API_PROJECT_NAME)
API_PROJECT_IMAGE_TAG=$(API_PROJECT_IMAGE):$(TAG)
API_PROJECT_IMAGE_LATEST=$(API_PROJECT_IMAGE):latest
MYSQL_ROOT_PASSWORD?=root

COMPOSE=IMAGE_NAME=$(IMAGE_LATEST) MYSQL_ROOT_PASSWORD=$(MYSQL_ROOT_PASSWORD) API_PROJECT_IMAGE_LATEST=$(API_PROJECT_IMAGE_LATEST) docker-compose -f docker-compose.development.yml

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
