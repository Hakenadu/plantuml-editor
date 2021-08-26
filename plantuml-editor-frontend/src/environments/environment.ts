export const environment = {
  production: false,
  // backendUrl: 'https://plantuml.mseiche.de/api',
  backendUrl: 'http://localhost:8080',
  configUrl: undefined,
  config: { // Default frontend config for local development without docker
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
