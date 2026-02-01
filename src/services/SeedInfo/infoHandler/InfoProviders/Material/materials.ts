// src/services/SeedInfo/infoHandler/InfoProviders/Material/materials.ts
import materialsData from "../../../data/materials.json";

export interface IMaterial {
  ui_name?: string;
  [key: string]: any;
}

// Simulating async load if it was dynamic, but here it's static.
// Using a function to maintain consistency with the extraction pattern.
export const getMaterials = async (): Promise<Record<string, IMaterial>> => {
  return materialsData as unknown as Record<string, IMaterial>;
};

export const getMaterialDisplayName = (
  materials: Record<string, IMaterial>,
  materialName: string,
  t?: (key: string, options?: any) => string,
): string => {
  if (materialName.charAt(0) === "(") {
    return materialName;
  }
  const found = materials[materialName];
  const uiName = found && found.ui_name ? found.ui_name : materialName;

  if (t) {
    return t(uiName, { ns: "materials" });
  }
  return uiName;
};
