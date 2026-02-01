// src/services/SeedInfo/infoHandler/InfoProviders/Material/useMaterialInfo.ts
import { useQuery } from "@tanstack/react-query";
import { getMaterials, getMaterialDisplayName } from "./materials";
import { useTranslation } from "react-i18next";

export const useMaterials = () => {
  return useQuery({
    queryKey: ["materials"],
    queryFn: getMaterials,
    staleTime: Infinity, // Materials don't change
  });
};

export const useMaterialDisplayName = () => {
  const { data: materials } = useMaterials();
  const { t } = useTranslation("materials");

  return (materialName: string) => {
    if (!materials) return materialName;
    return getMaterialDisplayName(materials, materialName, t);
  };
};
