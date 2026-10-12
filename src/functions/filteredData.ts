import { useMemo } from "react";

export const useFilteredData = <T extends Record<string, any>>(
  data: T[] | null | undefined,
  restrictedIds: string[],
  currentUserId: string,
  idKey: keyof T,
) => {
  return useMemo(() => {
    if (!data) return [];

    const safeCurrentUserId = currentUserId.toLowerCase();
    const safeRestrictedIds = restrictedIds.map((id) => id.toLowerCase());

    const isCurrentUserDev = safeRestrictedIds.includes(safeCurrentUserId);

    if (isCurrentUserDev) {
      return data;
    }

    return data.filter((item) => {
      const itemOwnerId = String(item[idKey]).toLowerCase();
      const isFromDevUser = safeRestrictedIds.includes(itemOwnerId);

      return !isFromDevUser;
    });
  }, [data, restrictedIds, currentUserId, idKey]); // Dependencias correctas
};
