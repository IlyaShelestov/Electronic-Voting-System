import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { login, logout } from "@/store/slices/userSlice";
import { userService } from "@/services/userService";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  getAuthToken,
  isTokenExpired,
  removeAuthToken,
} from "@/utils/tokenHelper";


const AuthChecker = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const validateSession = async () => {
      const token = getAuthToken();
      if (token && !isTokenExpired(token)) {
        try {
          const user = await userService.getUser();
          if (user) {
            dispatch(login(user));
          } else {
            performLogout();
          }
        } catch (error) {
          performLogout();
        }
      } else {
        performLogout();
      }
    };
  
    const performLogout = () => {
      removeAuthToken();
      dispatch(logout());
      router.push(`/${locale}/`);
    };
  
    validateSession();
  }, [dispatch, router, locale]);

  return null;
};

export default AuthChecker;
