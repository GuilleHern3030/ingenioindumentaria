export default {
  parseKB(size:number, digits:number=0) {
    return Number((size / 1024).toFixed(digits))
  },

  parseMB(size:number, digits:number=0) {
    return Number((size / 1024 / 1000).toFixed(digits))
  },

  parseGB(size:number, digits:number=0) {
    return Number((size / 1024 / 1000 / 1000).toFixed(digits))
  },

  toString(size:number) {
    if (size === 0) return '0'
    if (size > 1000) {
      const KB = size / 1024
      if (KB > 1000) {
        const MB = KB / 1000
        if (MB > 1000) {
          const GB = MB / 1000
          return `${GB.toFixed(2)} GB`
        } else return `${MB.toFixed(2)} MB`
      } else return `${KB.toFixed(1)} KB`
    } else return `${size.toFixed(0)} Bytes`
  }
}