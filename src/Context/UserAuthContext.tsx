import React, { ReactNode, createContext, useContext } from "react";
import { useUsersData } from "../hooks/useUsersData";

interface IUserProps {
  children?: any;
}

interface IUserAuthProps {
  gridData: any;
  updateUsersData: (val: boolean) => void;
}

const UserAuthContext = createContext({} as IUserAuthProps);

export function UserAuthProvider({ children }: IUserProps): JSX.Element {
  const { gridData, updateUsersData } = useUsersData();

  const memoedValue = React.useMemo(
    () => ({
      gridData,
      updateUsersData,
    }),

    [gridData]
  );

  return (
    <UserAuthContext.Provider value={memoedValue}>
      {children}
    </UserAuthContext.Provider>
  );
}

export default function useUserAuthContext() {
  return useContext(UserAuthContext);
}
