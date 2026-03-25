// User 1: Has BVN only
export const userWithBVN = {
  status: true,
  message: "BVN verified successfully",
  code: 200,
  data: {
    bvn: "22134567890",
    nin: null,
    first_name: "Gaurav",
    middle_name: "ADE",
    last_name: "OKAFOR",
    date_of_birth: "1994-05-21",
    gender: "Male",
    phone_number: "08034567891",
    email: "gaurav@email.com",
    nationality: "Nigerian",
    state_of_origin: "Lagos",
    lga: "Ikeja",
    residential_address: "12 Ade Street, Ikeja, Lagos",
    photo: "https://api.example.com/images/bvn/22134567890.jpg",
    enrollment_bank: "First Bank",
    registration_date: "2019-08-14",
    watch_listed: false
  }
};

// User 2: Has NIN only
export const userWithNIN = {
  status: true,
  message: "NIN verified successfully",
  code: 200,
  data: {
    bvn: null,
    nin: "12345678901",
    first_name: "Saurav",
    middle_name: "ADE",
    last_name: "OKAFOR",
    date_of_birth: "1994-05-21",
    gender: "Male",
    phone_number: "08034567892",
    email: "saurav@email.com",
    nationality: "Nigerian",
    state_of_origin: "Lagos",
    lga: "Ikeja",
    residential_address: "15 Ade Street, Ikeja, Lagos",
    photo: "https://api.example.com/images/nin/12345678901.jpg",
    enrollment_bank: null,
    registration_date: "2020-03-10",
    watch_listed: false
  }
};

// User 3: Has both BVN and NIN
export const userWithBoth = {
  status: true,
  message: "Verification successful",
  code: 200,
  data: {
    bvn: "22134567892",
    nin: "12345678902",
    first_name: "Hemant",
    middle_name: "ADE",
    last_name: "OKAFOR",
    date_of_birth: "1994-05-21",
    gender: "Male",
    phone_number: "08034567893",
    email: "hemant@email.com",
    nationality: "Nigerian",
    state_of_origin: "Lagos",
    lga: "Ikeja",
    residential_address: "20 Ade Street, Ikeja, Lagos",
    photo: "https://api.example.com/images/bvn/22134567892.jpg",
    enrollment_bank: "GTBank",
    registration_date: "2018-06-22",
    watch_listed: false
  }
};

// User 4: Has neither BVN nor NIN (not available)
export const userWithNone = {
  status: false,
  message: "No verification data available",
  code: 404,
  data: {
    bvn: null,
    nin: null,
    first_name: "Rahul",
    middle_name: "ADE",
    last_name: "OKAFOR",
    date_of_birth: "1996-08-15",
    gender: "Male",
    phone_number: "08034567894",
    email: "rahul@email.com",
    nationality: "Nigerian",
    state_of_origin: "Abuja",
    lga: "Garki",
    residential_address: "5 Main Street, Garki, Abuja",
    photo: null,
    enrollment_bank: null,
    registration_date: null,
    watch_listed: false
  }
};

// Export all users as an array
export const allUsers = [userWithBVN, userWithNIN, userWithBoth, userWithNone];