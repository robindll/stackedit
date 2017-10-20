import localDbSvc from './localDbSvc';

export default {
  /**
   * Export a file to disk.
   */
  saveToMembank(fileId) {
    return localDbSvc.loadItem(`${fileId}/content`)
      .then((content) => {
        alert(content.text);
      });
  },
};
