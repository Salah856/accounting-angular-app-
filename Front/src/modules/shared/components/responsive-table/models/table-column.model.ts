export interface TableColumn {
  name: string;
  label: string;
  filter ?: boolean;
  sortable ?: boolean;
  customTemplate ?: boolean;
  hideLabelInMobile ?: boolean;
  hide?: boolean;
  width?: string;
  require?: boolean;
  serverTranslate ?: boolean;
}
