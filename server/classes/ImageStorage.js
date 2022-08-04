const EasyYandexS3 = require('easy-yandex-s3');

class ImageStorage {
  constructor() {}

  getOrderedImagePaths() {}
}

class YandexS3ImageStorage extends ImageStorage {
  constructor() {
    super();
    this.storage = new EasyYandexS3({
      auth: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      Bucket: process.env.S3_BUCKET,
    });
    this.basePath = process.env.S3_BASE_PATH;
  }

  async getOrderedImagePaths(theme, kind) {
    const paths = await this.getImagePaths(theme, kind);
    const orderedPaths = this.orderPathsAlphanumerically(paths);
    const orderedImagePaths = this.removeDirectoryPath(orderedPaths);
    return this.produceFullPaths(orderedImagePaths);
  }

  async getImagePaths(theme, kind) {
    return this.storage.GetList(`/${theme}/${kind}/`);
  }

  orderPathsAlphanumerically(paths) {
    return paths.Contents.map(c => c.Key)
      .sort((a, b) => {
        return a.localeCompare(b, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      });
  }

  removeDirectoryPath(paths) {
    return paths.slice(1);
  }

  produceFullPaths(paths) {
    return paths.map(path => this.basePath + path);
  }
}

module.exports = YandexS3ImageStorage;
