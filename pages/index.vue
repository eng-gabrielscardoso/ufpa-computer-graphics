<template>
  <div class="w-full h-full lg:grid lg:grid-cols-12">
    <div
      class="col-12 p-2 flex flex-col lg:col-span-9 lg:items-center lg:justify-center gap-4"
    >
      <UInput
        type="file"
        size="xl"
        icon="i-heroicons-folder"
        accept=".jpg,.jpeg,.png,.bmp"
        class="w-full lg:w-fit"
        @change="onTargetChange"
      />
      <template v-if="targetPreview">
        <img
          :src="targetPreview"
          alt="Image Preview"
          class="max-w-full h-auto rounded-md shadow"
        />
      </template>
      <template v-if="targetProcessed">
        <canvas ref="targetProcessed" />
      </template>
    </div>
    <div
      class="col-12 p-2 flex flex-col lg:col-span-3 lg:items-center lg:justify-center"
    >
      <UCard class="w-full">
        <template #header>Computer Graphics Algorithms Live Demo</template>

        <!-- parameters goes here -->
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UButton type="submit" :disabled="!file">Submit</UButton>
        </UForm>
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
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const toast = useToast();

const file = ref<File | null>(null);
const targetPreview = ref<string | null>(null);
const targetProcessed = ref<string | null>(null);

const schema = z.object({});

type Schema = z.output<typeof schema>;

const state = reactive({});

const onTargetChange = (event: Event) => {
  const selectedFile = event?.[0] || event.target?.files?.[0]

  if (selectedFile && selectedFile.type.startsWith("image/")) {
    file.value = selectedFile;

    const reader = new FileReader();

    reader.onload = () => (targetPreview.value = reader.result as string);

    reader.readAsDataURL(selectedFile);

    toast.add({
      title: "Image uploaded successfully",
      description: "You can now update the parameters",
    });
  } else {
    toast.add({
      title: "Image could not be uploaded",
      description: "If the issue persists, please contact the support team",
    });

    targetPreview.value = null;
  }
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (!file.value) {
    toast.add({
      title: "No image selected",
      color: "red",
      description: "Please upload an image before submitting.",
    });
    return;
  }

  try {
    const parameters = {
      filterType: "mean",
    };

    const formData = new FormData();

    formData.append("file", file.value as File);
    formData.append("filterType", parameters.filterType);

    const response = await $fetch("/api/image-processing/noise-remover", {
      method: "POST",
      body: formData,
    });

    const canvas = ref<HTMLCanvasElement | null>(null);
    if (canvas.value) {
      const ctx = canvas.value.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.value.width = img.width;
        canvas.value.height = img.height;
        ctx?.drawImage(img, 0, 0);
      };

      img.src = response.data;
      targetProcessed.value = img.src;
    }
  } catch (error) {
    toast.add({
      title: "An error occurred during processing your image",
      color: "red",
      description: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
</script>
