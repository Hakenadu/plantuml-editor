export const environment = {
  production: false,
  backendUrl: 'https://plantuml.mseiche.de',
  config: { // Default frontend config for local development without docker
    footer: {
      actions: [
        {
          type: 'popup',
          icon: {
            type: 'material',
            name: 'privacy_tip'
          },
          tooltip: 'Privacy Policy and Terms of Service',
          content: `
            <div>
              This page belongs to
              <a href="https://mseiche.de" target="_blank">mseiche.de</a>
              therefore the following documents also apply for this page:
              <ul class="mb-0">
                <li><a href="https://mseiche.de/privacy-policy" target="_blank">Privacy Policy</a></li>
                <li><a href="https://mseiche.de/terms-of-service" target="_blank">Terms of Service</a></li>
                <li><a href="https://mseiche.de/about" target="_blank">About</a></li>
              </ul>
            </div>`
        },
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
