import { ConfigValue } from "../Config";
import Cookies from "js-cookie";

export const AUTH_TOKEN_KEY = ConfigValue.AUTH_CREATOR_TOKEN_KEY;
export const AUTH_USER_INFO = ConfigValue.AUTH_CREATOR_USER_INFO;

export const getAuthToken = () => {
  if (typeof window === undefined) {
    return null;
  }
  const cookie = Cookies.get(AUTH_TOKEN_KEY);
  if(cookie){
    try {
      return JSON.parse(cookie);
    } catch (error) {
      Cookies.remove(AUTH_TOKEN_KEY);
      return null;
    }
  } else
   return null;
};

export function setAuthToken(token) {
  Cookies.set(AUTH_TOKEN_KEY, JSON.stringify(token), { expires: 1 });
  Cookies.set(ConfigValue.AUTH_TOKEN_KEY, token.token, { expires: 1 });
  console.log("Setting cookies!: ", ConfigValue.AUTH_TOKEN_KEY, Cookies.get(ConfigValue.AUTH_TOKEN_KEY));
}

export function removeAuthToken() {
  Cookies.remove(AUTH_TOKEN_KEY);
  Cookies.remove(ConfigValue.AUTH_TOKEN_KEY);
}
