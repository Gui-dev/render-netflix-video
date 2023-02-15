class Network {
  constructor ({ host }) {
    this.host = host
  }

  parseManifestURL ({ url, fileResolution, fileResolutionTag, hostTag }) {
    return url.replace(fileResolutionTag, fileResolution).replace(hostTag, this.host)
  }

  async fetchFile (url) {
    const response = await fetch(url)
    return response.arrayBuffer()
  }

  async getProperResolution (url) {
    const startMs = Date.now()
    const response = await fetch(url)
    await response.arrayBuffer()
    const endMs = Date.now()
    const durationInMs = (endMs - startMs)
    const resolutions = [ // ao invés de calcular o throughPut, vamos calcular pelo tempo
      { start: 3001, end: 20000, resolution: 144 }, // acima 3 segundo
      { start: 901, end: 3000, resolution: 360 }, // até 3 segundo
      { start: 0, end: 900, resolution: 720 }, // menos de 1 segundo
    ]
    const item = resolutions.find(item => {
      return item.start <= durationInMs && item.end >= durationInMs
    })
    const LOWEST_RESOLUTION = 144
    if (!item) {
      return LOWEST_RESOLUTION
    }
    return item.resolution
  }
}
