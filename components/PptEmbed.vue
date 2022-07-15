<template>
  <vue-iframe
    :src="src"
    allow="camera *; geolocation *; microphone *; autoplay *"
    frame-id="my-ifram"
    @load="onLoad"
    name="my-frame"
    width="150px"
    height="200px"
  />
</template>

<script>
export default {
  name: 'MyIframe',
  data: () => ({
    src: 'https://docs.google.com/presentation/d/e/2PACX-1vQObdpCuBgBpfrvLqkC_DTp8YJlH3JfJxDpDpmNDWZH5CSj0NSNBY9UZ3WNRsnZttV6k44pxzg-vjeU/embed?start=true&loop=false&delayms=60000',
    myIframe: null
  }),
  methods: {
    onLoad (frame) {
      this.myIframe = frame.contentWindow
    }
  }
}
</script>
