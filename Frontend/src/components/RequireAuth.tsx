import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../slices/authSlice";
import type { JSX } from "react/jsx-runtime";

export function RequireAuth({ children }: { children: JSX.Element }) {
    // const user = useSelector(selectCurrentUser);
    // const location = useLocation();

    // if (!user) {
    //     return <Navigate to="/login" state={{ from: location }} replace />;
    // }

    return children;
}