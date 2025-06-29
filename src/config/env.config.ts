const ENV = {
  dev: {
    API_URL: 'https://api-prod.estateshub.co.in',
  },
  prod: {
    API_URL: 'https://api-prod.estateshub.co.in',
  },
  qa: {
    API_URL: 'https://api-prod.estateshub.co.in',
  },
  uat: {
    API_URL: 'https://api-prod.estateshub.co.in',
  },
  local: {
    API_URL: 'http://localhost:3000',
  },
};

const getEnvVars = (env = 'dev') => {
  if (env === 'prod') return ENV.uat;
  if (env === 'qa') return ENV.qa;
  if (env === 'uat') return ENV.uat;
  if (env === 'local') return ENV.local;
  return ENV.dev;
};

export default getEnvVars;