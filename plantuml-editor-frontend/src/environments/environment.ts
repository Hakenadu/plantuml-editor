export const environment = {
  production: false,
  backendUrl: 'https://plantuml.mseiche.de/api',
  // backendUrl: 'http://localhost:8081',
  configUrl: undefined,
  config: { // Default frontend config for local development without docker
    intro: {
      // description: '<h1>custom stuff</h2>',
      slideshow: {
        showMessage: true,
        visible: true
      }
    },
    share: {
      description: `
        <p>
          Your PlantUML spec will be stored symmetrically encrypted via
          <a href="https://en.wikipedia.org/wiki/WebDAV">WebDAV</a>.
        </p>
        <p>
          The information needed to decrypt the stored data is the id which is sent by your browser when accessing the data.
        </p>
        <p class="mb-0">
          Anyhow if you use this functionality you agree to my
          <a href="https://mseiche.de/terms-of-service">Terms of Service</a>
        </p>
      `,
      imageOnlyLinks: {
        visible: true
      }
    },
    footer: {
      actions: [
        {
          type: 'link',
          icon: {
            type: 'img',
            src: 'assets/images/github.svg',
            height: '28',
            width: '28'
          },
          href: 'https://github.com/Hakenadu/plantuml-editor',
          tooltip: 'View the code for this page on GitHub'
        }, {
          "type": "popup",
          "icon": {
            "type": "material",
            "name": "privacy_tip"
          },
          "content": "<div>This page belongs to <a href=\"https:\/\/mseiche.de\" target=\"_blank\">mseiche.de<\/a> therefore the following documents also apply for this page:<ul class=\"mb-0\"><li><a href=\"https:\/\/mseiche.de\/privacy-policy\" target=\"_blank\">Privacy Policy<\/a><\/li><li><a href=\"https:\/\/mseiche.de\/terms-of-service\" target=\"_blank\">Terms of Service<\/a><\/li><li><a href=\"https:\/\/mseiche.de\/about\" target=\"_blank\">About<\/a><\/li><\/ul><\/div>",
          "tooltip": "Privacy and Terms of Service"
        },

      ]
    }
  }
};
