<template>
  <div @click="handleClick">
    <div
    ref="me"
    contenteditable
    @input.stop="handleInput"
    @blur="handleDone"
    @keydown.enter="handleDone"
    @keypress.stop="handleKeyPress"
    @keyup="handleKeyUp"
    v-text="value"
    v-show="editing"></div>
    <span v-html="value" class="editable" v-if="!editing"></span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    maxLength: {
      type: Number,
      default: 500
    }
  },
  data () {
    return {
      editing: false
    }
  },
  methods: {
    handleInput () {
    },
    handleKeyUp (e) {
      // console.log(e.target.textContent.includes('[['))
      if (e.target.textContent.includes('[[')) {
        const start = e.target.textContent.split('[[')
        if (start.length > 1) {
          // console.log('handleKeyUp: ==')
          this.$emit('keyup', start.join('<span class="pink--text">➜</span>'))
        }
      } else if (e.target.textContent.includes(']]')) {
        const end = e.target.textContent.split(']]')
        if (end.length > 1) {
          // console.log('handleKeyUp: ==')
          this.$emit('keyup', end.join('<span class="pink--text">◀ </span>'))
        }
      } else if (e.target.textContent.includes('[x')) {
        const delstart = e.target.textContent.split('[x')
        if (delstart.length > 1) {
          // console.log('handleKeyUp: ==')
          const del = delstart.join('').split('<span class="pink--text">➜</span>').join('')
          this.$emit('keyup', del)
        }
      } else if (e.target.textContent.includes(']x')) {
        const delend = e.target.textContent.split(']x')
        if (delend.length > 1) {
          const del = delend.join('').split('<span class="pink--text">◀ </span>').join('')
          this.$emit('keyup', del)
        }
      }
    },
    handleKeyPress (e) {
      if (e.target.textContent.length >= this.maxLength) {
        e.preventDefault()
      }
    },
    handleClick () {
      this.editing = true
      setTimeout(() => {
        this.$refs.me.focus()
      }, 10)
    },
    handleDone (e) {
      // console.log(e.target.textContent)
      // this.$emit('clear', e.target.textContent)
      this.editing = false
    }
  }
}
</script>

<style scoped>
.editable:hover:before {
    content: '✎';
    position: absolute;
    left: -5px;
}

[contenteditable]:focus {
    outline: 1px solid #ddd;
    padding: 4px;
}
</style>
