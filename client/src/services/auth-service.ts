import Vue from 'vue';
import VueResource from 'vue-resource';
import consts from "../constants";

Vue.use(VueResource);

export const getGitHubAuthCode = (login: string) => {
   window.location.href =
      "https://github.com/login/oauth/authorize?login=" +
      login +
      "&client_id=" +
      consts.GITHUB_APP_CLIENT_ID +
      "&scope=repo";
}

/**
 * Get GitHub token by auth code from 1st step.
 * 
 * @param {string} authCode
 *
 * @return {Promise<VueResource.HttpResponse>}
*/
export const getGitHubToken = (authCode: string) => {
   return (Vue as any).http.post('http://192.168.1.143:3001/https://github.com/login/oauth/access_token?scope=repo',
      {
         'client_id': consts.GITHUB_APP_CLIENT_ID,
         'client_secret': consts.GITHUB_APP_CLIENT_SECRET,
         'code': authCode,
      },
      {
         headers: {
            'Accept': 'application/json',
            'X-OAuth-Scopes': 'repo',
            'x-requested-with': 'http://192.168.1.143:8080/',
         }
      }
   ) as Promise<VueResource.HttpResponse>
}
