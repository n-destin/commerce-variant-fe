import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { getProfile } from "../../services/auth";
import { queryKeys } from "../../utils/queryKeys";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/Auth";
import { useSignIn } from "react-auth-kit";
import { SyncLoader } from "react-spinners";

const ProcessAuth = () => {
  const context = useContext(AuthContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token") as string;
  console.log(token);
  const navigate = useNavigate();
  const signIn = useSignIn();
  const { data } = useQuery({
    queryFn: () => getProfile(token),
    queryKey: queryKeys.getProfile,
  });
  useEffect(() => {
    if (data) {
      context?.setIsLoggedIn(true);
      context?.setUser(data);
      signIn({
        token: token,
        tokenType: "Bearer",
        expiresIn: 60,
        authState: data,
      });
      navigate("/");
    }
  }, [data]);

  return (
    <div className='w-full h-screen'>
      <div className='flex w-full justify-center items-center h-full'>
        <SyncLoader color='#003D29' />
      </div>
    </div>
  );
};

export default ProcessAuth;
