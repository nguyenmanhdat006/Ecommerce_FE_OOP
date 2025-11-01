import axiosClient from "./axiosClient";

export const fileAPI = {
  // Upload 1 file
  uploadSingle: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    // Debug: log FormData entries
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    console.log("File details:", {
      name: file?.name,
      size: file?.size,
      type: file?.type
    });
    
    return axiosClient.post("api/uploads/upload", formData, {
      headers: {
        // KHÔNG set manual multipart/form-data
        // Axios sẽ tự động set Content-Type với boundary
      },
    });
  },

  // Upload nhiều file
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // backend expects "files"
    });

    return axiosClient.post("api/uploads/upload-multiple", formData);
  },

  // Lấy info file (ví dụ: name, size…)
  getInfo: (fileId) =>
    axiosClient.get("api/files/info", {
      params: { id: fileId },
    }),

  // Xoá file
  delete: (fileId) =>
    axiosClient.delete("api/uploads/delete", {
      params: { id: fileId },
    }),
};
