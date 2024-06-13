import React from "react";
import { UserAuthProvider } from "../Context/UserAuthContext";

export default function withUser(Component: React.ComponentType) {
  return (hocProps: any): any => {
    return (
      <UserAuthProvider>
        <Component {...hocProps} />
      </UserAuthProvider>
    );
  };
}
