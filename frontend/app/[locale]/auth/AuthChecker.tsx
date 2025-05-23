import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { login, logout } from "@/store/slices/userSlice";
import { userService } from "@/services/userService";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  getAuthToken,
  removeAuthToken,
} from "@/utils/tokenHelper";
import { setLoading } from "@/store/slices/loadingSlice";


const AuthChecker = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const validateSession = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const user = await userService.getUser();
          if (user) {
            dispatch(login(user));
          } else {
            performLogout();
          }
        } catch (error) {
          performLogout();
        } finally {
          dispatch(setLoading({ key: "auth", value: false }));
        }
      }
    };
  
    const performLogout = () => {
      removeAuthToken();
      dispatch(logout());
      router.push(`/${locale}/`);
    };
  
    validateSession();
  }, [dispatch, locale, router]);

  return null;
};

export default AuthChecker;
