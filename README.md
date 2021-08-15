# PlantUML Editor
Backend and frontend for a [PlantUML](https://plantuml.com/de/) editor web application 
![hakenadu/plantuml-editor logo](./plantuml-editor-frontend/src/favicon.svg)
* The backend generates images from [PlantUML](https://plantuml.com/de/) using [plantuml/plantuml](https://github.com/plantuml/plantuml). It also provides annotations in case of invalid source.
* The fully responsive frontend allows you to see the generated images as you type and also highlights syntax errors linewise

## How does it work?
![Sequence Diagram for hakenadu/plantuml-editor](./misc/plantuml-editor.svg)
<details>
  <summary>PlantUML source for this diagram</summary>
  
  ```
  @startuml

  autonumber

  actor Developer
  participant PlantUmlEditorFrontend
  participant PlantUmlEditorBackend

  activate Developer
  Developer -> PlantUmlEditorFrontend: type plantuml source

  activate PlantUmlEditorFrontend
  PlantUmlEditorFrontend -> PlantUmlEditorBackend: get annotations

  alt #pink source invalid
      PlantUmlEditorBackend --> PlantUmlEditorFrontend: error annotations
      deactivate PlantUmlEditorBackend
      PlantUmlEditorFrontend --> Developer: marked error annotation at specific line
  else #lightgreen source valid
      PlantUmlEditorBackend --> PlantUmlEditorFrontend: empty annotations
      deactivate PlantUmlEditorBackend
      PlantUmlEditorFrontend -> PlantUmlEditorBackend: generate image for source
      activate PlantUmlEditorBackend
      PlantUmlEditorBackend -> PlantUmlEditorBackend: generate image using plantuml/plantuml
      PlantUmlEditorBackend --> PlantUmlEditorFrontend: generated image
      deactivate PlantUmlEditorBackend
      PlantUmlEditorFrontend --> Developer: visualized generated image
  end

  deactivate PlantUmlEditorFrontend
  deactivate Developer

  @enduml
  ```

</details>

## Demo
A running demo is available at https://plantuml.mseiche.de/.

## Run via docker
```shell
docker run -d -p 80:80 --name plantuml-editor hakenadu/plantuml-editor
```

## Run via docker-compose
```yaml
plantuml-editor:
  image: hakenadu/plantuml-editor
  container_name: plantuml-editor
  ports:
  - "80:80"
```
