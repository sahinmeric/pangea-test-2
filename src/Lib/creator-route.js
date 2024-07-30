import { Navigate } from "react-router-dom";

import routes from "../Config/routes";
import {useCreatorAuth} from "../Hooks/creator-use-auth";

export default function CreatorRoute({ children }) {
  const { creatorToken } = useCreatorAuth();

  if (creatorToken==null) {
    return <Navigate to={routes.creatorLogin} />;
  }

  return <>{children}</>;
}
