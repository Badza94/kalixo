export enum EProcessingType {
  INSTANT = "instant", // (5 mins)
  FAST = "fast", // (30 mins)
  RAPID = "rapid", // (60 mins)
  SWIFT2 = "swift2", // (2 hrs)
  SWIFT3 = "swift3", // (3 hrs)
  SWIFT4 = "swift4", // (4 hrs)
  SWIFT5 = "swift5", // (5 hrs)
  STANDARD6 = "standard6", // (6 hrs)
  STANDARD10 = "standard10", // (10 hrs)
  SLOW12 = "slow12", // (12 hrs)
  SLOW18 = "slow18", // (18 hrs)
  DELAYED = "delayed", // (24 hrs)
}

export const processingTimeOptions = [
  { value: EProcessingType.INSTANT, label: "Instant (5 min)" },
  { value: EProcessingType.FAST, label: "Fast (30 min)" },
  { value: EProcessingType.RAPID, label: "Rapid (60 min)" },
  { value: EProcessingType.SWIFT2, label: "Swift (2 hr)" },
  { value: EProcessingType.SWIFT3, label: "Swift (3 hr)" },
  { value: EProcessingType.SWIFT4, label: "Swift (4 hr)" },
  { value: EProcessingType.SWIFT5, label: "Swift (5 hr)" },
  { value: EProcessingType.STANDARD6, label: "Standard (6 hr)" },
  { value: EProcessingType.STANDARD10, label: "Standard (10 hr)" },
  { value: EProcessingType.SLOW12, label: "Slow (12 hr)" },
  { value: EProcessingType.SLOW18, label: "Slow (18 hr)" },
  { value: EProcessingType.DELAYED, label: "Delayed (24 hr)" },
];
