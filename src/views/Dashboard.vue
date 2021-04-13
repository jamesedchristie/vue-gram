<template>
  <div id="dashboard">
    <transition class="fade">
      <CommentModal
        v-if="showCommentModal"
        v-bind:post="selectedPost"
        @close="toggleCommentModal"
      />
    </transition>
    <section>
      <div class="col1">
        <div class="profile">
          <h5>{{ userProfile.title }} {{ userProfile.name }}</h5>
          <div class="create-post">
            <p>create a post</p>
            <form @submit.prevent>
              <textarea v-model.trim="newPost.content"></textarea>
              <button
                class="button"
                @click="createPost()"
                :disabled="newPost.content == ''"
              >
                post
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="col2">
        <div>
          <div v-if="posts.length">
            <div v-for="post in posts" :key="post.id" class="post">
              <h5>{{ post.userName }}</h5>
              <span>{{ post.createdOn | formatDate }}</span>
              <p>{{ post.content | trimLength }}</p>
              <ul>
                <li>
                  <a @click="toggleCommentModal(post)"
                    >comments {{ post.comments }}</a
                  >
                </li>
                <li>
                  <a @click="likePost(post.id, post.likes)"
                    >likes {{ post.likes }}</a
                  >
                </li>
                <li><a @click="viewPost(post)">view full post</a></li>
              </ul>
            </div>
          </div>
          <p v-else class="no-results">There are currently no posts</p>
        </div>
      </div>
    </section>
    <!-- full post modal -->
    <transition name="fade">
      <div v-if="showPostModal" class="p-modal">
        <div class="p-container">
          <a @click="closePostModal()" class="close">close</a>
          <div class="post">
            <h5>{{ fullPost.userName }}</h5>
            <span>{{ fullPost.createdOn | formatDate }}</span>
            <p>{{ fullPost.content }}</p>
            <ul>
              <li>
                <a>comments {{ fullPost.comments }}</a>
              </li>
              <li>
                <a>likes {{ fullPost.likes }}</a>
              </li>
            </ul>
          </div>
          <div v-show="postComments.length" class="comments">
            <div
              v-for="comment in postComments"
              :key="comment.id"
              class="comment"
            >
              <p>{{ comment.userName }}</p>
              <span>{{ comment.createdOn | formatDate }}</span>
              <p>{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import CommentModal from "../components/CommentModal";
import { commentsCollection } from '../firebase';

export default {
  name: "Dashboard",
  components: {
    CommentModal,
  },
  data() {
    return {
      newPost: {
        content: "",
      },
      showCommentModal: false,
      selectedPost: {},
      fullPost: {},
      postComments: [],
      showPostModal: false
    };
  },
  computed: {
    ...mapState(["userProfile", "posts"]),
  },
  methods: {
    createPost() {
      this.$store.dispatch("createPost", {
        content: this.newPost.content,
      });
      this.newPost.content = "";
    },
    toggleCommentModal(post) {
      this.showCommentModal = !this.showCommentModal;
      if (this.showCommentModal) {
        this.selectedPost = post;
      } else {
        this.selectedPost = {};
      }
    },
    likePost(id, likes) {
      this.$store.dispatch("likePost", { id, likes });
    },
    async viewPost(post) {
        const docs = await commentsCollection.where('postId', '==', post.id).get();
        docs.forEach(doc => {
            let comment = doc.data();
            comment.id = doc.id;
            this.postComments.push(comment);
        });

        this.fullPost = post;
        this.showPostModal = true;
    },
    closePostModal() {
        this.showPostModal = false;
        this.postComments = [];
    }
  },
  filters: {
    formatDate(val) {
      if (!val) return "-";
      let date = val.toDate();
      return moment(date).fromNow();
    },
    trimLength(val) {
      if (val.length < 200) return val;
      return `${val.substring(0, 200)}...`;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>