export interface ScopeItem {
  id?: string;
  name?: string;
  childrenCount?: number;
}

export class DynamicFlatNode {
  constructor(public item: ScopeItem, public level = 1, public expandable = false,
              public isLoading = false) {}
}