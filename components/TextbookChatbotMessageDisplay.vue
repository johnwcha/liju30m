<template>
  <div
    ref="containerMessageDisplay"
    style="{background: #FAFAFA; height: 400px; overflow: scroll;}"
    class="container-message-display"
    @scroll="updateScrollState">
    <div class="loader">
      <div class="message-loading"></div>
    </div>
    <div v-for="(msg, index) in messages" :key="index" class="message-container">
        <v-list-item :class="{ 'd-flex flex-row-reverse': msg.me }">
          <v-alert
            v-if="msg.me"
            max-width="350"
            color="info"
            text
          >
            {{ msg.content }}
            <sub
                class="ml-2"
                style="font-size: 0.7rem;"
            >{{ msg.created_at }}</sub>
          </v-alert>
            <!-- --- -->
          <v-alert
            v-else
            max-width="350"
            text
            color="orange lighten-1"
          >
          <v-progress-circular
            v-if="msg.content === ''"
            :size="20"
            :width="2"
            color="red"
            indeterminate
          ></v-progress-circular>
            {{ msg.content }}
            <sub
                class="ml-2"
                style="font-size: 0.7rem;"
            >{{ msg.created_at }}</sub>
            </v-alert>
            </v-list-item>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      required: true
    },
    asyncMode: {
      type: Boolean,
      required: false,
      default: true
    },
    /* loadMoreMessages: {
      type: Function,
      required: false,
      default: null
    },
    onImageClicked: {
        type: Function,
        required: false,
        default: null
    }, */
    scrollBottom: {
      type: Object,
      required: false,
      default: () => {
        return {
          messageSent: true,
          messageReceived: false
        }
      }
    }
  },
  data () {
    return {
      updateScroll: true,
      lastMessage: null,
      loading: true
    }
  },
  mounted () {
    this.goToBottom()
    this.$refs.containerMessageDisplay.dispatchEvent(new CustomEvent('scroll'))
  },
  updated () {
    this.goToBottom()
  },
  methods: {
    /**
     * This function compare two messages without looking at the uploaded propertie.
     * This function has been implemented to prevent chat scrolling down after changing the message from 'uploaded = false' to 'uploaded = true'.
     * @param {Object} message1 the first message object
     * @param {Object} message2 the second message object
     * @return {Boolean} true if the messages are equal and false if they are different
     */
    messageCompare (message1, message2) {
      /**
       * if one of the messages are null, you can safely compare the messages with '==='
       */
      if (!message2 || !message1) {
        return message1 === message2
      }
      /**
       * compare the immutable properties of a message
       */
      const participantEqual = message1.participantId === message2.participantId
      const contentEqual = message1.content === message2.content
      const timestampEqual = message1.timestamp.valueOf() === message2.timestamp.valueOf()

      return participantEqual && contentEqual && timestampEqual
    },
    updateScrollState ({ target: { scrollTop, clientHeight, scrollHeight } }) {
      this.updateScroll = scrollTop + clientHeight >= scrollHeight

      /* if (typeof this.loadMoreMessages === 'function' && scrollTop < 20) {
        this.loading = true
        this.loadMoreMessages((messages) => {
          this.loading = false
        })
      } */
    },
    goToBottom () {
      const scrollDiv = this.$refs.containerMessageDisplay
      scrollDiv.scrollTop = scrollDiv.scrollHeight
      this.updateScroll = false
    },
    onImageClicked (message) {
      this.$emit('onImageClicked', message)
    }
  }
}
</script>

<style scoped>
    .quick-chat-container .container-message-display {
        flex: 1;
        overflow-y: scroll;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
        max-height: 100%;
                /************** Safari 10.1+ ********************/
        @media not all and (min-resolution:.001dpcm)
        { @supports (-webkit-appearance:none) {

            .message-container{
                display:-webkit-box !important;
            }
        }}

        .message-image{
            padding: 6px 10px;
            border-radius: 15px;
            margin: 5px 0 5px 0;
            max-width: 70%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .message-image-display{
            width: 100%;
            border-radius: 5px;
            cursor:pointer;
            transition: 0.3s ease;
        }

        .message-image-display:hover{
            opacity: 0.8;
        }

        .message-text > p {
            margin: 5px 0 5px 0;
            font-size: 14px;
        }

        .my-message > .message-timestamp {
            text-align: right;
        }

        /* .my-message {
            justify-content: flex-end;
            padding-right: 15px;
            align-items: flex-end;
        } */

        .other-message {
            justify-content: flex-start;
            padding-left: 15px;
            align-items: flex-start;
        }

        .other-message > .message-text {
            color: #fff;
            border-bottom-left-radius: 0;
        }

        .my-message > .message-text {
            border-bottom-right-radius: 0;
        }

        .message-container {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
        }

        .message-username {
            font-size: 10px;
            font-weight: bold;
        }

        .icon-sent {
            padding-left: 5px;
            color: rgb(129, 127, 127);
        }

        .message-loading {
            height: 8px;
            width: 8px;
            border: 1px solid rgb(187, 183, 183);
            border-left-color: rgb(59, 59, 59);
            border-radius: 50%;
            margin-left: 5px;
            display: inline-block;
            animation: spin 1.3s ease infinite;
        }

        .loader .message-loading {
            width: 16px;
            height: 16px;
            margin: 5px 0 0 0;
        }

        .img-loading{
            height: 20px;
            width: 20px;
            border: 3px solid #ffffff00;
            border-left-color: #847f7f;
            border-top-color: #847f7f;
            border-radius: 50%;
            margin-left: 5px;
            display: inline-block;
            -webkit-animation: spin 1.0s ease infinite;
            animation: spin 1.0s ease infinite;
            position: absolute;
        }
        .img-overlay{
            opacity: 0.4;
        }

        .message-username-image{
            margin: 10px 10px 0px 10px;
            font-size: 12px;
            font-weight: bold;
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
