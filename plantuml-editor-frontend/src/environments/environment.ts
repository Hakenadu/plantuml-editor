export const environment = {
  production: false,
  // backendUrl: 'https://plantuml.mseiche.de/api',
  backendUrl: 'http://localhost:8080',
  configUrl: undefined,
  config: { // Default frontend config for local development without docker
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
      `
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
