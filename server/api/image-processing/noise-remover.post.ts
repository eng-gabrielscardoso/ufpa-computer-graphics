import { noiseRemover } from "~/server/scripts/image-processing/noise-remover";
import { ResponseStatus } from "~/support/reponseStatus";

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);

  const { file, parameters } = formData

  if (!file || !(file instanceof File)) {
    return {
      statusCode: ResponseStatus.BAD_REQUEST,
      body: {
        success: false,
        message: "Please provide a valid image",
      },
    };
  }

  try {
    const imageData = await noiseRemover(file, parameters);

    return {
      statusCode: ResponseStatus.OK,
      body: {
        success: true,
        message: 'Noise removal successful',
        data: imageData,
      },
    };
  } catch (error) {
    return {
      statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: 'An error occurred during noise removal',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
});
