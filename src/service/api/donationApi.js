import axiosClient from "../instance";

export const getStaffEventSchedule = async () => {
  const response = await axiosClient.get("/events/staffs/schedule");
  return response;
};

export const getUserRegistration = async (ticketCode) => {
  const response = await axiosClient.get(`/events/${ticketCode}/user-registration`);
  return response;
};

export const createDonation = async (donationData, thumbnailFiles = []) => {
  const formData = new FormData();
  formData.append("event", JSON.stringify(donationData));

  if (thumbnailFiles && thumbnailFiles.length > 0) {
    thumbnailFiles.forEach((file) => {
      formData.append("thumbnail", file, file.name);
    });
  }

  const response = await axiosClient.post("/donations", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });

  return response;
};

export const getMyDonations = async () => {
  const response = await axiosClient.get("/donations/my-donations");
  return response;
};

export default {
  getStaffEventSchedule,
  getUserRegistration,
  createDonation,
  getMyDonations,
};

