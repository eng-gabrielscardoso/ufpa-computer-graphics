import * as THREE from "three";

export async function noiseRemover(
  file: File,
  filterType: "mean" | "median" | "gaussian"
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const imageUrl = event.target?.result as string;
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(
        imageUrl,
        (texture) => {
          const image = texture.image;

          const width = image.width;
          const height = image.height;
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d");

          if (!context)
            return reject(new Error("Canvas context não suportado"));

          context.drawImage(image, 0, 0);
          const imageData = context.getImageData(0, 0, width, height);
          const { data } = imageData;

          const applyMeanFilter = () => {
            const newData = new Uint8ClampedArray(data);
            for (let y = 1; y < height - 1; y++) {
              for (let x = 1; x < width - 1; x++) {
                const index = (y * width + x) * 4;
                let sumR = 0,
                  sumG = 0,
                  sumB = 0,
                  sumA = 0;
                const neighbors = [-1, 0, 1].flatMap((dy) =>
                  [-1, 0, 1].map((dx) => index + (dy * width + dx) * 4)
                );

                neighbors.forEach((i) => {
                  sumR += data[i];
                  sumG += data[i + 1];
                  sumB += data[i + 2];
                  sumA += data[i + 3];
                });

                const count = neighbors.length;
                newData[index] = sumR / count;
                newData[index + 1] = sumG / count;
                newData[index + 2] = sumB / count;
                newData[index + 3] = sumA / count;
              }
            }
            imageData.data.set(newData);
          };

          const applyMedianFilter = () => {
            const newData = new Uint8ClampedArray(data);
            for (let y = 1; y < height - 1; y++) {
              for (let x = 1; x < width - 1; x++) {
                const index = (y * width + x) * 4;
                const neighbors = [-1, 0, 1].flatMap((dy) =>
                  [-1, 0, 1].map((dx) => index + (dy * width + dx) * 4)
                );

                const rValues = neighbors
                  .map((i) => data[i])
                  .sort((a, b) => a - b);
                const gValues = neighbors
                  .map((i) => data[i + 1])
                  .sort((a, b) => a - b);
                const bValues = neighbors
                  .map((i) => data[i + 2])
                  .sort((a, b) => a - b);
                const aValues = neighbors
                  .map((i) => data[i + 3])
                  .sort((a, b) => a - b);

                newData[index] = rValues[Math.floor(neighbors.length / 2)];
                newData[index + 1] = gValues[Math.floor(neighbors.length / 2)];
                newData[index + 2] = bValues[Math.floor(neighbors.length / 2)];
                newData[index + 3] = aValues[Math.floor(neighbors.length / 2)];
              }
            }
            imageData.data.set(newData);
          };

          const applyGaussianFilter = () => {
            const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1];
            const newData = new Uint8ClampedArray(data);
            for (let y = 1; y < height - 1; y++) {
              for (let x = 1; x < width - 1; x++) {
                const index = (y * width + x) * 4;
                let r = 0,
                  g = 0,
                  b = 0,
                  a = 0;
                let weightSum = 0;
                kernel.forEach((weight, i) => {
                  const dy = Math.floor(i / 3) - 1;
                  const dx = (i % 3) - 1;
                  const neighborIndex = index + (dy * width + dx) * 4;

                  r += data[neighborIndex] * weight;
                  g += data[neighborIndex + 1] * weight;
                  b += data[neighborIndex + 2] * weight;
                  a += data[neighborIndex + 3] * weight;
                  weightSum += weight;
                });

                newData[index] = r / weightSum;
                newData[index + 1] = g / weightSum;
                newData[index + 2] = b / weightSum;
                newData[index + 3] = a / weightSum;
              }
            }
            imageData.data.set(newData);
          };

          switch (filterType) {
            case "mean":
              applyMeanFilter();
              break;
            case "median":
              applyMedianFilter();
              break;
            case "gaussian":
              applyGaussianFilter();
              break;
            default:
              return reject(new Error("Invalid parameter"));
          }

          resolve(imageData);
        },
        undefined,
        (error) => reject(error)
      );
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
