console.log(process.env.REACT_APP_DEBUG)

const DEBUG = process.env.REACT_APP_DEBUG || "false";

const API_URL = (process.env.REACT_APP_DEBUG == "true")
    ? "http://localhost:4000"
    : "https://collabtime-mern-backend.onrender.com";

console.log(API_URL)

export default API_URL;