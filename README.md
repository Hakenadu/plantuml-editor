# PlantUML Editor
Backend and frontend for a [PlantUML](https://plantuml.com/de/) editor web application:
* The backend generates images from [PlantUML](https://plantuml.com/de/) using the [plantuml.jar](https://github.com/plantuml/plantuml). It also provides annotations in case of invalid source.
* The fully responsive frontend allows you to see the generated images as you type and also highlights syntax errors linewise

## Run via docker
```shell
docker run -d -p 80:80 --name plantuml-editor hakenadu/plantuml-editor
```
