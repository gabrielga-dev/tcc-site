export const FileUtil = {
  DOWNLOAD_PDF: (filename, data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); //or any other extension
      document.body.appendChild(link);
      link.click();
  }
}
