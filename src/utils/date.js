export const formatTime = (d) =>
  d
    ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

export const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "");
