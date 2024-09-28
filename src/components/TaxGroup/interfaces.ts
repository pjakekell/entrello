export interface ITaxGroup {
  id: string;
  name: string;
  tax_rate?: number;
}

export interface ITaxGroupModal {
  creatingTaxGroupName: string,
  handleTaxGroupModalState?: (state: boolean, newValue?: string) => void,
  selectedOption?: { id: string, name: string, tax_rate: number },
  isModalCreating: boolean
}