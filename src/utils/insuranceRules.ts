export interface StateRule {
  minBI_Person: number;
  minBI_Accident: number;
  minPD: number;
  pipRequired: boolean;
  umRequired: boolean;
  isNoFault: boolean;
}

export const STATE_RULES: Record<string, StateRule> = {
  CA: {
    minBI_Person: 15000,
    minBI_Accident: 30000,
    minPD: 5000,
    pipRequired: false,
    umRequired: false,
    isNoFault: false,
  },
  TX: {
    minBI_Person: 30000,
    minBI_Accident: 60000,
    minPD: 25000,
    pipRequired: true, // PIP must be offered, can be rejected in writing
    umRequired: false,
    isNoFault: false,
  },
  NY: {
    minBI_Person: 25000,
    minBI_Accident: 50000,
    minPD: 10000,
    pipRequired: true,
    umRequired: true,
    isNoFault: true,
  },
  FL: {
    minBI_Person: 10000, // PD only state for basic, but usually 10/20 BI
    minBI_Accident: 20000,
    minPD: 10000,
    pipRequired: true,
    umRequired: false,
    isNoFault: true,
  },
};

export const DEFAULT_RULE: StateRule = {
  minBI_Person: 25000,
  minBI_Accident: 50000,
  minPD: 25000,
  pipRequired: false,
  umRequired: false,
  isNoFault: false,
};
