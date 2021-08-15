# PlantUML Editor

* [How does it work?](#how-does-it-work)  
* [Screenshot](#screenshot)
* [Demo](#demo)
* [Basic usage](#basic-usage)
    * [run with docker](#run-with-docker)
    * [run with docker-compose](#run-with-docker-compose) 
* [Customized usage](#customized-usage)
    * [run with docker](#run-with-docker)
    * [run with docker-compose](#run-with-docker-compose) 


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

### Screenshot
![Screenshot](./misc/plantuml-editor-demo-snapshot.png)

## Demo
A running demo is available at https://plantuml.mseiche.de/.

## Basic usage
### run with docker
```shell
docker run -d -p 80:80 --name plantuml-editor hakenadu/plantuml-editor
```

### run with docker-compose
```yaml
plantuml-editor:
  image: hakenadu/plantuml-editor
  container_name: plantuml-editor
  ports:
  - "80:80"
```

## Customized usage
You may customize parts of the application by providing config options.
At the moment it is possible to override the default set footer icons (atm the link to this GitHub repository) with a custom set of icons.
This can especially be useful, if you need to provide a custom privacy policy.

### Frontend config
For the app published at https://plantuml.mseiche.de/ I'm using the following *frontend-config.json*

```json
{
   "footer": {
      "actions": [
         {
            "type": "popup",
            "icon": {
               "type": "material",
               "name": "privacy_tip"
            },
            "content": "<div>This page belongs to <a href=\"https:\/\/mseiche.de\" target=\"_blank\">mseiche.de<\/a> therefore the following documents also apply for this page:<ul class=\"mb-0\"><li><a href=\"https:\/\/mseiche.de\/privacy-policy\" target=\"_blank\">Privacy Policy<\/a><\/li><li><a href=\"https:\/\/mseiche.de\/terms-of-service\" target=\"_blank\">Terms of Service<\/a><\/li><li><a href=\"https:\/\/mseiche.de\/about\" target=\"_blank\">About<\/a><\/li><\/ul><\/div>",
            "tooltip": "Privacy and Terms of Service"
         },
         {
            "type": "link",
            "icon": {
               "type": "img",
               "src": "assets/images/github.svg",
               "width": "28",
               "height": "28"
            },
            "href": "https://github.com/Hakenadu/plantuml-editor",
            "tooltip": "View the code for this page on GitHub"
         },
         {
            "type": "link",
            "icon": {
               "type": "img",
               "src": "assets/images/mseiche.svg",
               "width": "28",
               "height": "28"
            },
            "href": "https://mseiche.de",
            "tooltip": "Visit my main page"
         }
      ]
   }
}
```

#### Footer actions
The following types of actions are supported:
* *popup* contains a custom html template which will be shown in a popup menu after clicking the generated action button
* *link* opens a provided link in a new tab after clicking the generated action button

each action can be parameterized with the following attributes:
* *tooltip* (optional) contains a text which will be shown while hovering the generated action button
* *icon* controls the appearance of the generated action button

#### Icons
Currently two types of icons are supported:
* *material* shows a [google material icon](https://fonts.google.com/icons) by its name
* *img* shows an image using an img tag and a resource uri

### run with docker

### run with docker-compose
