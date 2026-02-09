<script setup>
import Navbar from './components/Navbar.vue';

</script>

<template>
  <div id="app">

    <Navbar/>
    <router-view/>
  </div>
</template>

<style>

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  cursor: pointer;
}

.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
