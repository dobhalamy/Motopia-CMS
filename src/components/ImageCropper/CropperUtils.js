const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
a * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
export default async function getCroppedImg(imageSrc, { width, height, x, y }, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = width
  canvas.height = height
  
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
  
  const ImgURI = imageSrc.split('/')
  const imageName = ImgURI[ImgURI.length-1]

  // As a blob
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      blob.lastModifiedDate = new Date()
      blob.name = imageName
      blob.path = imageName
      blob.originalname = imageName
      blob.preview = URL.createObjectURL(blob)
      resolve({
        blob,
      })
    })
  })
}
