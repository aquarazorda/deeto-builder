export const fieldType = [
  "boolean",
  "date",
  "file",
  "hidden",
  "multiple",
  "number",
  "single",
  "text",
  "time",
] as const;

export const fieldRepresentation = [
  "boolean",
  "checkbox",
  "currencyDollar",
  "date",
  "file",
  "hidden",
  "kpiGroup",
  "percentage",
  "radio",
  "select",
  "text",
  "textarea",
  "time",
] as const;

export const viewModeIcons = [
  "KPI_announcement",
  "KPI_BRAIN",
  "KPI_BRIEFCASE",
  "KPI_CERTIFICATE",
  "KPI_CHECKLIST",
  "KPI_CHESE",
  "KPI_CITY_WIFI",
  "KPI_CLASSBOARD",
  "KPI_CONNECTION",
  "KPI_ECOMM",
  "KPI_FIND",
  "KPI_GLOBAL",
  "KPI_GOAL",
  "KPI_GRAPH_CHART",
  "KPI_LAUNCH",
  "KPI_LIGHTBULB",
  "KPI_MAN_ON_COMPUTER",
  "KPI_MONEY",
  "KPI_NAVIGATION",
  "KPI_NETWORK",
  "KPI_ON_TARGET",
  "KPI_PATH_TO_MONEY",
  "KPI_PEOPLE",
  "KPI_PIECHART",
  "KPI_SEARCH_PERSON",
  "KPI_STARS",
  "KPI_SUCCESS",
  "KPI_TARGET",
  "KPI_TREE_MONEY",
  "KPI_WIFI",
] as const;

export type CustomizedFormValues = Array<{
  customizedFormValueId: string;
  accountContactId: string;
  referralId: string;
  formType: string;
  customizedFormFieldId: string;
  fieldName: string;
  fieldLabel: string;
  valueCaption: string;
  value: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  customizedFormField: CustomizedFormField;
}>;

export type CustomizedFormField = {
  customizedFormFieldId: string;
  vendorId: string;
  formType: string;
  fieldName: string;
  fieldLabel: string;
  isSalesforceMapped: boolean;
  fieldType: (typeof fieldType)[number];
  fieldMetaType: string;
  fieldRepresentation: (typeof fieldRepresentation)[number];
  fieldValidation: string;
  viewModeLabel: string;
  viewModeIcon: (typeof viewModeIcons)[number];
  isMandatory: boolean;
  useWithReference: boolean;
  useWithProspect: boolean;
  useWithVendor: boolean;
  appearanceOrder: number;
  optionsOrderBy: string;
  isUsedInLargeTabInfo: boolean;
  isUsedInSmallTabInfo: boolean;
  referenceField: string;
  matchingAlgorithm: string;
  matchingStrength: number;
  isPubliclyVisible: boolean;
  createdAt: string;
  updatedAt: string;
};
