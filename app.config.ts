import type { TAlgorithm } from "./support/algorithms";


export default defineAppConfig({
  /**
   * @todo with this config also block requests for related endpoints
   */
  availableAlgorithms: [
    {
      label: 'Noise remover',
      endpoint: '/api/image-processing/noise-remover'
    }
  ] as TAlgorithm[]
})
