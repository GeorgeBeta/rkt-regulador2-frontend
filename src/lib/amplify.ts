import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.PUBLIC_USER_POOL_ID,
      userPoolClientId: import.meta.env.PUBLIC_USER_POOL_CLIENT_ID,
      identityPoolId: import.meta.env.PUBLIC_IDENTITY_POOL_ID,
    },
  },
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;