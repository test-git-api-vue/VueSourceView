import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import RepositoryInfo from 'src/Models/repositoryInfo'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
})],
  state: {
    authenticated: false,
    userLogin: '',
    userToken: '',
    repositories: [] as Array<RepositoryInfo>,
    branches: [],
    selectedBranchName: '',
    commits: [],
    selectedRepository : {} as RepositoryInfo,
    lastUpdatedCommitsList: {}
  },
  mutations: {
    setLogin(state, payload)
    {
      state.userLogin = payload;
    },
    setToken(state, payload)
    {
      state.userToken = payload;
    },
    setRepositories(state, payload)
    {
      state.repositories = payload;
    },
    setCommits(state, payload)
    {
      state.commits = payload;
    },
    setLastUpdatedCommitsList(state, payload)
    {
      state.lastUpdatedCommitsList = payload;
    },
    setBranches(state, payload)
    {
      state.branches = payload;
    },
    setSelectedRepository(state, payload)
    {
      state.selectedRepository = payload;
    },
    setSelectedBranchName(state, payload)
    {
      state.selectedBranchName = payload;
    }
  },
  actions: {
    setLogin(context, login)
    {
      context.commit('setLogin', login);
    },
    setToken(context, token)
    {
      context.commit('setToken', token);
    },
    setRepositories(context, repositories)
    {
      context.commit('setRepositories', repositories);
    },
    setCommits(context, commits){
      context.commit('setCommits', commits);
      context.commit('setLastUpdatedCommitsList', new Date());
    },
    setBranches(context, branches)
    {
      context.commit('setBranches', branches);
    },
    setSelectedRepository(context, repository)
    {
      context.commit('setSelectedRepository', repository);
    },
    setSelectedBranchName(context, branchName)
    {
      context.commit('setSelectedBranchName', branchName);
    }
  },
  modules: {
    
  }
})
