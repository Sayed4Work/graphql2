  export const Audit = [
    {
      label: 'Done',
      value: 70.48,
    },
    {
      label: 'Recieved',
      value: 28.8,
    },
  ];
    
  export const Audits = [
    ...Audit.map((v) => ({
      ...v,
      label: v.label,
      value: v.value,
    })),
  ];
  
  export const valueFormatter = (item) => `${item.value}%`;