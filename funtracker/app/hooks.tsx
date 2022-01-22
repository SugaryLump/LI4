import { useContext } from "react";
import { AuthContext } from "./auth";

export function useAuthContext() {
    return useContext(AuthContext)
}