export const environment = {
  production: false,
  // backendUrl: 'https://plantuml.mseiche.de/api',
  backendUrl: 'http://localhost:8081',
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
        visible: true,
        warningMessage: `
          If an image only link is used, the key is inserted as a query parameter for a GET request.
          The key is therefore more likely to appear in reverse proxy logs.
        `
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
        }
      ]
    }
  }
};
