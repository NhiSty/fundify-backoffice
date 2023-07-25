/* eslint-disable no-param-reassign */
import { createStore } from 'vuex';
import jwtDecode from 'jwt-decode';

const store = createStore({
  state() {
    return {
      id: null,
      selectedProduct: null,
      isLoggedIn: false,
      isMerchant: false,
      isApproved: false,
      isAdmin: false,
    };
  },
  getters: {
    getSelectedProduct(state) {
      return state.selectedProduct;
    },
    getAuthData(state) {
      return {
        isLoggedIn: state.isLoggedIn,
        isMerchant: state.isMerchant,
        isApproved: state.isApproved,
        isAdmin: state.isAdmin,
      };
    },
  },
  mutations: {
    setSelectedProduct(state, product) {
      state.selectedProduct = product;
    },
    setAuthData(state, payload) {
      state.id = payload.id;
      state.isLoggedIn = payload.isLoggedIn;
      state.isMerchant = payload.isMerchant;
      state.isApproved = payload.isApproved;
      state.isAdmin = payload.isAdmin;
    },
  },
  actions: {
    setProduct({ commit }, product) {
      commit('setSelectedProduct', product);
    },
    checkAuth({ commit }) {
      const token = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('token='));
      if (token) {
        const decoded = jwtDecode(token.split('=')[1]);
        commit('setAuthData', {
          id: decoded.id,
          isLoggedIn: true,
          isMerchant: decoded.approved === true,
          isApproved: decoded.approved === true,
          isAdmin: decoded.isAdmin === true,
        });
      } else {
        commit('setAuthData', {
          id: null,
          isLoggedIn: false,
          isMerchant: false,
          isApproved: false,
          isAdmin: false,
        });
      }
    },
    async logout({ commit }) {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        commit('setAuthData', {
          isLoggedIn: false,
          isMerchant: false,
          isApproved: false,
          isAdmin: false,
        });
        console.log(`Navbar is ${this.state.isLoggedIn}`);
        window.location.href = '/';
      } else {
        console.log('Une erreur est survenue');
      }
    },
  },
});

export default store;
