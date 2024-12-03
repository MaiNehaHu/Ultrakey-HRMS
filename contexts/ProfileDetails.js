import { createContext, useContext, useState } from "react";
export const ProfileContext = createContext();

export const ProfileDetailsProvider = ({ children }) => {
  const [profileDetails, setProfileDetails] = useState({
    name: "Neha Kumari",
    designation: "Android Developer",
    employeeID: "AKEY24015",
    phoneNumber: "+91 93931 191932",
    email: "nehakumari@ultrakeyit.com",
    dob: "02/12/2003",
    bloodGroup: "A+",
    PANCard: "EPIO98989Y",
    emergencyPhoneNumber1: "+91 98982 24242",
    emergencyPhoneNumber2: "+91 67435 24242",
    educationList: [
      {
        title: "Graduation",
        institute: "MLRITM",
        batchFrom: "2020",
        batchTo: "2024",
        grade: "8.21",
        degree: "B.Tech",
      },
      {
        title: "High School",
        institute: "Sri Chaitanya Junior Kalashala",
        batchFrom: "2018",
        batchTo: "2020",
        grade: "9.00",
        degree: "12th (Intermediate)",
      },
    ],
    experienceList: [
      {
        type: "Internship",
        company: "KaizIQ",
        workFrom: "Oct, 2023",
        workTo: "Jan, 2024",
        designation: "UI/UX Intern",
      },
      {
        type: "Internship",
        company: "QuadB Technologies",
        workFrom: "June, 2023",
        workTo: "Feb, 2024",
        designation: "React JS Developer",
      },
    ],
    bankDetails: [
      {
        bankName: "UNION BANK OF INDIA",
        branchName: "Kukatpally Hyderabad",
        IFSC: "AKEY24015",
        accountNumber: "1122222234567",
      },
    ],
    familyInformation: [
      {
        name: "Rajeev Kumar",
        relation: "Father",
        contact: "+91 96969 69696",
        bank_details_id: 0,
      },
    ],
  });

  return (
    <ProfileContext.Provider value={{ profileDetails, setProfileDetails }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
