<template>
  <label class="radio-btn">
    <input 
      type="radio" 
      :name="name" 
      :value="value" 
      v-model="localChecked" 
      @change="handleChange" 
    />
    <div class="btn-label d-flex ga-2">
      <div 
        style="border: 2px solid white; border-radius: 100%; width: 20px; height: 20px; display: flex; justify-content: center; align-items: center;"
      >
        <i class="fas fa-check" style="font-size: 12px; margin-left: 7px;"></i>
      </div>
      {{ label }}
    </div>
  </label>
</template>

<script>
import { ref, defineProps, watch, defineEmits } from 'vue';

export default {
  name: 'CheckboxButton',
  props: {
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const localChecked = ref(props.modelValue);

    watch(localChecked, (newValue) => {
      emit('update:modelValue', newValue); // Emit the updated value to the parent
    });

    const handleChange = () => {
      emit('update:modelValue', props.value); // Emit the selected value
    };

    // Watch for changes in props to sync local state with parent
    watch(() => props.modelValue, (newValue) => {
      localChecked.value = newValue;
    });

    return {
      localChecked,
      handleChange,
    };
  },
};
</script>

<style scoped>
.radio-btn input[type="radio"] {
  display: none; /* Hide the default radio button */
}

.radio-btn {
  display: inline-block;
  cursor: pointer; /* Style to show it's clickable */
}

.radio-btn .btn-label {
  display: flex;
  justify-content: center;
  align-items: center; /* Align icon and text */
  background-color: #ccc;
  padding: 10px 20px;
  color: white;
  border-radius: 20px;
  font-size: 12px;
  transition: background-color 0.3s;
}

.radio-btn .btn-label i {
  margin-right: 8px; /* Space between icon and text */
  opacity: 0; /* Hide icon initially */
  transition: opacity 0.3s; /* Transition for smooth effect */
}

.radio-btn input[type="radio"]:checked + .btn-label {
  background-color: #4caf50; /* Change background when checked */
}

.radio-btn input[type="radio"]:checked + .btn-label i {
  opacity: 1; /* Show the icon when checked */
}

.radio-btn .btn-label:hover {
  background-color: #888; /* Add hover effect */
}
</style>
