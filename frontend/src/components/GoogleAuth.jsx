import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;; 
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;; 

function GoogleAuth() {
  const navigate = useNavigate(); 
  const handleSuccess = async (response) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/google`, {
        token: response.credential,
      });
      alert(`Welcome ${res.data.name}`);
      navigate("/SNPDatabase");
    } catch (error) {
      console.error("Google Sign-In Failed", error);
    }
  };

  const handleError = () => {
    console.log("Google Sign-In Failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </GoogleOAuthProvider>
  );
}

export default GoogleAuth;
