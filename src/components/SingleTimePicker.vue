<template>
  <div class="single-time-picker">
    <select v-model="selectedTime">
      <option v-for="time in times" :key="time" :value="time">{{ time }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'SingleTimePicker',
  props: {
    value: String 
  },
  data() {
    return {
      selectedTime: ''
    };
  },
  computed: {
    times() {
      const timeOptions = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 1) { 
          const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
          timeOptions.push(formattedTime);
        }
      }
      return timeOptions;
    }
  },
  watch: {
    selectedTime(newValue) {
      this.$emit('input', newValue);
    }
  }
};
</script>
