DOCKER_REGISTRY?=localhost:5000
TAG?=latest
PROJECT?=prontopiso/frontend
IMAGE=$(DOCKER_REGISTRY)/$(PROJECT)
IMAGE_TAG=$(IMAGE):$(TAG)
IMAGE_LATEST=$(IMAGE):latest

COMPOSE=IMAGE_NAME=$(IMAGE_LATEST) FRONTEND_CONTAINER_NAME=$(FRONTEND_CONTAINER_NAME) docker-compose -f docker/docker-compose.yml

all: build push

build:
	docker build . -t $(IMAGE)
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

.PHONY: all build
