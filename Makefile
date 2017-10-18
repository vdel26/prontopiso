DOCKER_REGISTRY?=localhost:5000
TAG?=latest
PROJECT?=prontopiso/frontend
IMAGE=$(DOCKER_REGISTRY)/$(PROJECT)
IMAGE_TAG=$(IMAGE):$(TAG)
IMAGE_LATEST=$(IMAGE):latest
FRONTEND_CONTAINER_NAME?=build_prontopiso_frontend

COMPOSE=IMAGE_NAME=$(IMAGE_LATEST) FRONTEND_CONTAINER_NAME=$(FRONTEND_CONTAINER_NAME) docker-compose -f docker/docker-compose.yml

build:
	$(COMPOSE) stop
	$(COMPOSE) rm -vf
	$(COMPOSE) build
	$(COMPOSE) up -d
	$(COMPOSE) stop
	$(COMPOSE) rm -vf
push:
	$(shell [ ! -z "$(AWS_ACCESS_KEY_ID)" -a ! -z "$(AWS_SECRET_ACCESS_KEY)" ] \
		&& docker run --rm -i \
		--env AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) \
		--env AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) \
		--env AWS_DEFAULT_REGION=eu-west-1 \
		mikesir87/aws-cli \
		aws ecr get-login --no-include-email)
	docker tag $(IMAGE_LATEST) $(IMAGE_TAG)
	docker push $(IMAGE_TAG)
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
