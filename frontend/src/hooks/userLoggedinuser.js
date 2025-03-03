import { useState, useEffect } from "react";
import { useUserAuth } from "../context/Userauthcontext";

const userLoggedinuser = () => {
  const { user } = useUserAuth();
  const email = user?.email;
  const [loggedinuser, setLoggedinuser] = useState({});

  useEffect(() => {
    if (email) {
      fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/users/loggedinuser?email=${email}`
      )
        .then((res) => res.json())
        .then((data) => {
          setLoggedinuser(data);
        })
        .catch((error) => {
          console.error("Error fetching logged in user:", error);
        });
    }
  }, [email]);

  return [loggedinuser, setLoggedinuser];
};

export default userLoggedinuser;
