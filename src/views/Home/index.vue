<template>
  <div class="home">
    <OrderForm />
  </div>
</template>

<script>
import OrderForm from "@/components/OrderForm.vue";

export default {
  name: "Home",
  components: {
    OrderForm,
  },
};
</script>
