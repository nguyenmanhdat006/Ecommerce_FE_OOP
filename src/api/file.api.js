import axiosClient from "./axiosClient";

export const fileAPI = {
  // Upload 1 file
  uploadSingle: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosClient.post("api/files/upload", formData, {
      headers: {
        // KHÔNG set manual multipart/form-data
      },
    });
  },

  // Upload nhiều file
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // backend expects "files"
    });

    return axiosClient.post("api/files/upload-multiple", formData);
  },

  // Lấy info file (ví dụ: name, size…)
  getInfo: (fileId) =>
    axiosClient.get("api/files/info", {
      params: { id: fileId },
    }),

  // Xoá file
  delete: (fileId) =>
    axiosClient.delete("api/files/delete", {
      params: { id: fileId },
    }),
};
