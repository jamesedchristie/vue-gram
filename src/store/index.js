import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userProfile: {},
    posts: []
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setPosts(state, val) {
      state.posts = val;
    }
  },
  actions: {
    async login({ dispatch }, form) {
      //Sign user in
      const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password);
      //Fetch user profile and set in state
      dispatch('fetchUserProfile', user);
    },
    async fetchUserProfile({ commit }, user) {
      //fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get();
      //set user profile in state
      commit('setUserProfile', userProfile.data());
      if (router.currentRoute.path === '/login') {
        router.push('/');
      }
    },
    async signup({ dispatch }, form) {
      //Create user auth
      const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password);
      
      //Create user profile
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
        title: form.title
      });
      //Fetch new profile and set in state
      dispatch('fetchUserProfile', user);
    },
    async logout({ commit }) {
      //Log out user
      await fb.auth.signOut();
      //Clear user data
      commit('setUserProfile', {});
      //Redirect to login
      router.push('/login');
    },
    async createPost({ state }, newPost) {
      await fb.postsCollection.add({
        createdOn: new Date(),
        content: newPost.content,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        comments: 0,
        likes: 0
      })
    },
    async likePost({ commit }, post) {
      const userId = fb.auth.currentUser.uid;
      const docId = `$${userId}_${post.id}`;
      //Check if user has already liked post
      const doc = await fb.likesCollection.doc(docId).get();
      if (doc.exists) return;
      //Record like
      await fb.likesCollection.doc(docId).set({
        postId: post.id,
        userId: userId
      });
      fb.postsCollection.doc(post.id).update({
        likes: post.likes + 1
      });
    },
    async updateProfile({ dispatch }, newProfile) {
      //Get user id
      let userId = fb.auth.currentUser.uid;
      //Update profile
      await fb.usersCollection.doc(userId).update({
        name: newProfile.name,
        title: newProfile.title
      });
      //Fetch user profile
      dispatch('fetchUserProfile', { uid: userId });

      //Get all posts by user and update name for each
      const posts = await fb.postsCollection.where('userId', '==', userId).get();
      posts.forEach(post => {
          fb.postsCollection.doc(post.id).update({
          userName: newProfile.name
        });
      });
      //Do same for comments
      let comments = await fb.commentsCollection.where('userId', '==', userId).get();
      comments.forEach(comment => {
        fb.commentsCollection.doc(comment.id).update({
          userName: newProfile.name
        });
      });
    }
  },
  modules: {
  }
});

//Get all posts, ordered newest to oldest
fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
  //Array to store the posts
  let postsArray = [];
  //Get post from each doc, assigning id, and add to array
  snapshot.forEach(doc => {
    let post = doc.data();
    post.id = doc.id;
    postsArray.push(post);
  });

  store.commit('setPosts', postsArray);
})

export default store;
