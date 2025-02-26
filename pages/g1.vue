<template>
  <div>
    <v-form @submit.prevent>
      <button type="submit" @click="handleSubmit3('value1')">
        b-1
      </button>
      <button type="submit" @click="handleSubmit3('value2')">
        b-2
      </button>
    </v-form>
  </div>
</template>

<script setup>
const handleSubmit3 = (value) => {
  console.log(value);
};
</script>

<style lang="scss" scoped>

</style>
