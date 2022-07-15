<template>
  <DemoBase :docid="docid" />
</template>

<script>
export default {
  layout: 'nomenu',
  computed: {
    docid () {
      return this.$route.query.id
    }
  }
}
</script>
