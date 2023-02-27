<template>
   <div class="container">
      <div class="main">
         <div class="login">
            <LoginBox/>
         </div>

         <div class="loginSecond__box">
            <p>Görüşləri və iclasları keçirmək üçün görüş otaqlarını əvvəlcədən planlayın</p>
         </div>
      </div>
   </div>
</template>

<script>
import LoginBox from "./LoginBox.vue";

export default {
   components: {
      LoginBox,
   }
}
</script>