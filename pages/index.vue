<template>
  <div class="w-full h-full lg:grid lg:grid-cols-12">
    <div class="col-12 p-4 flex flex-col lg:col-span-9 lg:items-center lg:justify-center gap-4">
      <UInput
        type="file"
        size="xl"
        icon="i-heroicons-folder"
        accept=".jpg,.jpeg,.png,.bmp"
        class="w-full lg:w-fit"
        @change="onTargetChange"
      />
      <template v-if="targetPreview">
        <img :src="targetPreview" alt="Image Preview" class="max-w-full h-auto rounded-md shadow" />
      </template>
    </div>
    <div class="col-12 p-4 flex flex-col lg:col-span-3 lg:items-center lg:justify-center">
      <UCard class="w-full">
        <template #header>Computer Graphics Algorithms Live Demo</template>

        <!-- parameters goes here -->
        parameteres
        <!-- parameters goes here -->

        <template #footer>
          Developed by
          <ULink
            to="https://gabrielscardoso.com"
            active-class="text-primary"
            inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >Gabriel Santos Cardoso</ULink
          >
        </template>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
const toast = useToast()

const targetPreview = ref<string | null>(null)

const onTargetChange = (event: Event) => {
  const file = event?.[0] || event.target?.files?.[0]

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()

    reader.onload = () => (targetPreview.value = reader.result as string)

    reader.readAsDataURL(file)

    toast.add({
      title: 'Image uploaded successfully',
      description: 'You can now update the parameters',
    })
  } else {
    toast.add({
      title: 'Image could not be uploaded',
      description: 'If the issue persists, please contact the support team',
    })

    targetPreview.value = null
  }
}
</script>
