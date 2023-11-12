# Dockerhub

- https://docs.docker.com/get-started/04_sharing_app/
- `docker image ls` 找出合適的名稱，例如「docker-app-pdf-annotation-extractor_app」
- 建立對應的repo https://hub.docker.com/
- https://hub.docker.com/repository/docker/pudding/docker-app/general
- pudding/docker-app
- `docker tag docker-app-pdf-annotation-extractor_app pudding/docker-app:node-18-20230518`
- `docker push pudding/docker-app:node-18-20230518`
- 修改Dockerfile `FROM pudding/docker-app:node-18-20230518`