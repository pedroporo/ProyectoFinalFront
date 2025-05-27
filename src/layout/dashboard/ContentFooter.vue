<template>
  <footer class="footer">
    <div class="container-fluid">
      <ul class="nav">
        <li class="nav-item">
          <a class="nav-link" href="https://github.com/pedroporo">
            pedroporo1000
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="https://github.com/pedroporo?tab=repositories"> Repositorios </a>
        </li>
        
      </ul>
      <div class="copyright">
        © {{ year }} hecho con <i class="tim-icons icon-heart-2"></i> por
        <a href="https://github.com/pedroporo" target="_blank" rel="noopener"
          >pedroporo1000</a
        >
        
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
};
</script>
<style></style>
