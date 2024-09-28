import jwt_decode from "jwt-decode";

export const useAuth = () => {
  const token = localStorage.getItem("t");
  if (!token) return false;

  var decoded: any = jwt_decode(token);
  var exp = isNaN(decoded.exp)
    ? new Date(decoded.exp)
    : new Date(decoded.exp * 1000);
  if (exp > new Date()) return decoded;

  localStorage.removeItem("t");
  return {};
};
