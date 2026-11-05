import { createForminitNuxtHandler } from 'forminit/nuxt';

// Proxy between the browser and Forminit: adds the secret API token on the server.
// The config is read inside the handler (at request time) so env vars set on the host are honoured.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const forminitHandler = createForminitNuxtHandler({
    apiKey: config.forminitApiKey,
  });

  return await forminitHandler(event);
});
