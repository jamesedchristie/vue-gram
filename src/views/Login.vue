<template>
  <div id="login">
    <section>
      <div class="col1">
        <h1>Vuegram</h1>
        <p>Welcome to Vuegram!</p>
      </div>
      <div :class="{ 'signup-form': !existingUser }" class="col2">
        <form v-if="existingUser" @submit.prevent>
          <h2>Welcome back!</h2>
          <div>
            <label for="email1">Email</label>
            <input
              type="text"
              placeholder="you@email.com"
              id="email1"
              v-model.trim="loginForm.email"
            />
          </div>
          <div>
            <label for="password1">Password</label>
            <input
              type="password"
              placeholder="******"
              id="password1"
              v-model.trim="loginForm.password"
            />
          </div>
          <button class="button" @click="login()">Log In</button>
          <div class="extras">
            <a @click="toggleForgotPassword()">Forgot Password</a>
            <a @click="toggleForm()">Create an Account</a>
          </div>
        </form>

        <form v-else @submit.prevent>
          <h1>Get Started</h1>
          <div>
            <label for="name">Name</label>
            <input
              v-model.trim="signupForm.name"
              type="text"
              placeholder="Savvy Apps"
              id="name"
            />
          </div>
          <div>
            <label for="title">Title</label>
            <input
              v-model.trim="signupForm.title"
              type="text"
              placeholder="Company"
              id="title"
            />
          </div>
          <div>
            <label for="email2">Email</label>
            <input
              v-model.trim="signupForm.email"
              type="text"
              placeholder="you@email.com"
              id="email2"
            />
          </div>
          <div>
            <label for="password2">Password</label>
            <input
              v-model.trim="signupForm.password"
              type="password"
              placeholder="min 6 characters"
              id="password2"
            />
          </div>
          <button @click="signup()" class="button">Sign Up</button>
          <div class="extras">
            <a @click="toggleForm()">Back to Log In</a>
          </div>
        </form>
      </div>
    </section>
    <PasswordReset v-if="forgotPassword" @close="toggleForgotPassword()" />
  </div>
</template>

<script>
import PasswordReset from "../components/PasswordReset";

export default {
  name: "Login",
  components: {
    PasswordReset,
  },
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
      signupForm: {
        name: "",
        title: "",
        email: "",
        password: "",
      },
      existingUser: true,
      forgotPassword: false,
    };
  },
  methods: {
    login() {
      //Dispatch action to vuex
      this.$store.dispatch("login", {
        email: this.loginForm.email,
        password: this.loginForm.password,
      });
    },
    signup() {
      //Dispatch action to vuex
      this.$store.dispatch("signup", {
        name: this.signupForm.name,
        title: this.signupForm.title,
        email: this.signupForm.email,
        password: this.signupForm.password,
      });
    },
    toggleForm() {
      this.existingUser = !this.existingUser;
    },
    toggleForgotPassword() {
      this.forgotPassword = !this.forgotPassword;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>