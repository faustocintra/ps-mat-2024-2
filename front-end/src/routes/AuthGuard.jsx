import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import myfetch from "../lib/myfetch";
import AuthUserContext from "../contexts/AuthUserContext";
import useWaiting from "../ui/useWaiting";

export default function AuthGuard({ children }) {
  const { setAuthUser, authUser, setRedirectLocation } =
    React.useContext(AuthUserContext);

  const location = useLocation();
  const { showWaiting, Waiting } = useWaiting();
  const navigate = useNavigate();

  async function checkAuthUser() {
    setAuthUser(null);

    showWaiting(true);
    try {
      const authUser = await myfetch.get("/users/me");
      setAuthUser(authUser);
    } catch (error) {
      console.error(error);
      navigate("/login", { replace: true });
    } finally {
      showWaiting(false);
    }
  }

  React.useEffect(() => {
    // Salva a rota atual para posterior redirecionamento,
    // Caso a rota atual não seja o próprio login
    if (!location.pathname.includes("login")) setRedirectLocation(location);
    checkAuthUser();
  }, [location]);

  // Enquanto ainda não temos a resposta do back-end para /users/me,
  // exibimos um componente Waiting
  if (!authUser) return <Waiting />;

  return authUser ? children : <Navigate to="/login" replace />;
}
