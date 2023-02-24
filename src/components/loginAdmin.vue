<template>
    <div class="main">
        <div class="login">
            <LoginBoxAdmin/>

            <h3 class="login__box-title">
                Designed & developed by <span>AlVentures</span>
            </h3>
        </div>
        <div class="main loginSecond__box"></div>
    </div>
</template>

<script>
import LoginBoxAdmin from "./LoginBoxAdmin.vue";

export default {
    components: {
        LoginBoxAdmin,
    },
};
</script>


