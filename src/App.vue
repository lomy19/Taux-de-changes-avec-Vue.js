<template>
  <nav>
    <router-link to="/">Option API</router-link> |
    <router-link to="/composition">Composition API</router-link>
  </nav>
  <router-view/>
</template>

<!-- Mon CSS - Me suis aidée de Copilot pour les parties de CSS que je n'arrivais
     pas forcément à faire tel que le fond qui bouge un peu -->
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inria+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Maven+Pro:wght@400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

  body {
    background-color: darkblue;
    color: black;
    overflow: hidden;
  }

  body::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, royalblue 20%, transparent);
    animation: moveGradient 20s infinite linear;
    opacity: 0.8;
  }

  @keyframes moveGradient {
    0% {
      transform: translate(-50%, -50%);
    }
    50% {
      transform: translate(0%, 0%);
    }
    100% {
      transform: translate(-50%, -50%);
    }
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    position: relative;
    z-index: 1;
  }

  nav {
    padding: 30px;
  }

  nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  nav a.router-link-exact-active {
    color: #42b983;
  }
</style>
