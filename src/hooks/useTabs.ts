import React from "react";

import common from "../utils/common";

export function useTabs(roleId: any) {
  const { tabData } = common;

  //.filter(({ role }) => role.includes(authData.roleId));

  //   const [tabs, setTabs] = React.useState(tabData);

  //   React.useEffect(() => {
  //     setTabs(tabData.filter(({ role }) => role.includes(roleId)));
  //   }, [roleId]);

  const tabs = React.useMemo(() => {
    return tabData.filter(({ role }) => role.includes(roleId));
  }, [roleId]);
  return { tabs };
}
