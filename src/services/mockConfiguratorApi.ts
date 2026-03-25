export type ConfigFieldKey =
  | "leafType"
  | "doorType"
  | "handing"
  | "structuralHeight"
  | "structuralWidth"
  | "lockType"
  | "colour";

export type ConfigSelections = Partial<Record<ConfigFieldKey, string>>;

export type ConfigOption = {
  value: string;
  label: string;
};

export type ConfigField = {
  key: ConfigFieldKey;
  label: string;
  type?: "select" | "input" | "colour";
  inputType?: "text" | "number";
  options: ConfigOption[];
};

export type ConfiguratorResponse = {
  visibleFields: ConfigField[];
  isComplete: boolean;
  unitPrice: number;
  drawingLabel: string;
  drawingUrl?: string;
  technicalNotes: string[];
};

type BasePriceBand = {
  leafType: "single" | "double";
  minHeight: number;
  maxHeight: number;
  minWidth: number;
  maxWidth: number;
  price: number;
};

type MatrixPriceMap = Record<
  string,
  {
    single: number;
    double: number;
  }
>;

const basePriceMatrix: BasePriceBand[] = [
  { leafType: "single", minHeight: 1000, maxHeight: 2150, minWidth: 900, maxWidth: 1010, price: 647.37 },
  { leafType: "single", minHeight: 1000, maxHeight: 2150, minWidth: 1011, maxWidth: 1210, price: 652.63 },
  { leafType: "single", minHeight: 1000, maxHeight: 2150, minWidth: 1211, maxWidth: 1460, price: 756.14 },

  { leafType: "single", minHeight: 2151, maxHeight: 2500, minWidth: 900, maxWidth: 1010, price: 698.25 },
  { leafType: "single", minHeight: 2151, maxHeight: 2500, minWidth: 1011, maxWidth: 1210, price: 703.51 },
  { leafType: "single", minHeight: 2151, maxHeight: 2500, minWidth: 1211, maxWidth: 1460, price: 784.21 },

  { leafType: "single", minHeight: 2501, maxHeight: 2960, minWidth: 900, maxWidth: 1010, price: 778.95 },
  { leafType: "single", minHeight: 2501, maxHeight: 2960, minWidth: 1011, maxWidth: 1210, price: 785.96 },
  { leafType: "single", minHeight: 2501, maxHeight: 2960, minWidth: 1211, maxWidth: 1460, price: 875.44 },

  { leafType: "double", minHeight: 1000, maxHeight: 1400, minWidth: 1000, maxWidth: 1400, price: 1207.02 },
  { leafType: "double", minHeight: 1000, maxHeight: 1400, minWidth: 1401, maxWidth: 1800, price: 1228.07 },
  { leafType: "double", minHeight: 1000, maxHeight: 1400, minWidth: 1801, maxWidth: 2200, price: 1238.60 },

  { leafType: "double", minHeight: 1401, maxHeight: 1800, minWidth: 1000, maxWidth: 1400, price: 1278.95 },
  { leafType: "double", minHeight: 1401, maxHeight: 1800, minWidth: 1401, maxWidth: 1800, price: 1300.00 },
  { leafType: "double", minHeight: 1401, maxHeight: 1800, minWidth: 1801, maxWidth: 2200, price: 1310.53 },

  { leafType: "double", minHeight: 1801, maxHeight: 2200, minWidth: 1000, maxWidth: 1400, price: 1421.05 },
  { leafType: "double", minHeight: 1801, maxHeight: 2200, minWidth: 1401, maxWidth: 1800, price: 1438.60 },
  { leafType: "double", minHeight: 1801, maxHeight: 2200, minWidth: 1801, maxWidth: 2200, price: 1457.89 },
];

const doorTypePrices: MatrixPriceMap = {
  "vision-panel-406x406": { single: 127.56, double: 127.56 },
  "vision-panel-203x711": { single: 132.65, double: 132.65 },
  "vision-panel-203x1168": { single: 197.4, double: 197.4 },
  "vision-panel-203x508": { single: 126.14, double: 126.14 },
  "vision-panel-508x508": { single: 187.02, double: 187.02 },
  "louvre-panel-457x457": { single: 236.3, double: 236.3 },
  "louvre-panel-457x1500": { single: 388.32, double: 388.32 },
};

const lockTypePrices: MatrixPriceMap = {
  "exidor-296-panic-hardware": { single: 77.26, double: 77.26 },
  "exidor-294-panic-hardware": { single: 116.65, double: 116.65 },
  "exidor-302-outside-access-device": { single: 78.68, double: 78.68 },
  "exidor-322-outside-access-device": { single: 78.68, double: 78.68 },
  "flush-bolts": { single: 0, double: 28.7 },
  "exidor-285-panic-escape": { single: 0, double: 198.6 },
  "sashlock-with-lever-handles": { single: 56.7, double: 56.7 },
  thumbturn: { single: 6.07, double: 6.07 },
  nightlatch: { single: 57.96, double: 57.96 },
  "electric-strike": { single: 117.11, double: 117.11 },
  "deadlock-with-cylinder": { single: 43.23, double: 43.23 },
  "pull-handle-with-push-plate": { single: 29.39, double: 29.39 },
  "closer-ts2000": { single: 65.79, double: 65.79 },
  "closer-ts4000": { single: 100.0, double: 100.0 },
  selector: { single: 0, double: 103.04 },
  "door-stay-150": { single: 36.89, double: 36.89 },
  "kickplates-200mm": { single: 27.19, double: 27.19 },
};

const leafTypeOptions: ConfigOption[] = [
  { value: "single", label: "Single" },
  { value: "double", label: "Double" },
];

const handingOptionsByLeafType: Record<string, ConfigOption[]> = {
  single: [
    { value: "left-hand-in", label: "Left Hand In" },
    { value: "right-hand-in", label: "Right Hand In" },
    { value: "left-hand-out", label: "Left Hand Out" },
    { value: "right-hand-out", label: "Right Hand Out" },
  ],
  double: [
    { value: "left-active", label: "Left Active" },
    { value: "right-active", label: "Right Active" },
  ],
};

const doorTypeOptions: ConfigOption[] = [
  { value: "vision-panel-406x406", label: "Vision Panel 406x406 each" },
  { value: "vision-panel-203x711", label: "Vision Panel 203x711 each" },
  { value: "vision-panel-203x1168", label: "Vision Panel 203x1168 each" },
  { value: "vision-panel-203x508", label: "Vision Panel 203x508 each" },
  { value: "vision-panel-508x508", label: "Vision Panel 508x508 each" },
  { value: "louvre-panel-457x457", label: "Louvre Panel 457x457 each" },
  { value: "louvre-panel-457x1500", label: "Louvre Panel 457x1500 each" },
];

const lockTypeOptions: ConfigOption[] = [
  { value: "exidor-296-panic-hardware", label: "Exidor 296 Panic Hardware" },
  { value: "exidor-294-panic-hardware", label: "Exidor 294 Panic Hardware" },
  { value: "exidor-302-outside-access-device", label: "Exidor 302 Outside Access Device" },
  { value: "exidor-322-outside-access-device", label: "Exidor 322 Outside Access Device" },
  { value: "flush-bolts", label: "Flush bolts (leaf set) to inactive leaf" },
  { value: "exidor-285-panic-escape", label: "Exidor 285 Panic Escape to both leaves" },
  { value: "sashlock-with-lever-handles", label: "Sashlock c/w lever handles" },
  { value: "thumbturn", label: "Thumbturn" },
  { value: "nightlatch", label: "Nightlatch c/w lever handle internal/finger pull external" },
  { value: "electric-strike", label: "Electric Strike (only in use with above nightlatch)" },
  { value: "deadlock-with-cylinder", label: "Deadlock with dbl cylinder" },
  { value: "pull-handle-with-push-plate", label: "Pull handle 300x19mm c/w 75x350mm push plate to opposite side - per leaf" },
  { value: "closer-ts2000", label: "Closer (TS2000) per leaf" },
  { value: "closer-ts4000", label: "Closer (TS4000) per leaf" },
  { value: "selector", label: "Selector" },
  { value: "door-stay-150", label: "Door Stay 150 (per leaf)" },
  { value: "kickplates-200mm", label: "Kickplates (200mm) each" },
];

const colourOptions: ConfigOption[] = [
  { value: "grey", label: "Grey" },
  { value: "black", label: "Black" },
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
];



function getBasePrice(
  leafType?: string,
  structuralHeight?: string,
  structuralWidth?: string
) {
  const height = Number(structuralHeight);
  const width = Number(structuralWidth);

  if (!leafType || !Number.isFinite(height) || !Number.isFinite(width)) {
    return 0;
  }

  const match = basePriceMatrix.find(
    (band) =>
      band.leafType === leafType &&
      height >= band.minHeight &&
      height <= band.maxHeight &&
      width >= band.minWidth &&
      width <= band.maxWidth
  );

  return match?.price ?? 0;
}

function getMatrixAddonPrice(map: MatrixPriceMap, key?: string, leafType?: string) {
  if (!key || !leafType) return 0;
  const entry = map[key];
  if (!entry) return 0;
  return leafType === "double" ? entry.double : entry.single;
}

function buildDrawingUrl(selections: ConfigSelections) {
  const leafType = selections.leafType ?? "unselected";
  const handing = selections.handing ?? "unselected";
  const colour = selections.colour ?? "grey";
  return `/api/drawings/${leafType}/${handing}/${colour}`;
}

function buildDrawingLabel(selections: ConfigSelections) {
  const parts = [selections.leafType, selections.handing, selections.colour].filter(Boolean);

  if (parts.length === 0) {
    return "Enter a door reference, then begin the drawing preview.";
  }

  return `Drawing preview for ${parts.join(" / ")}`;
}

function getTechnicalNotes(selections: ConfigSelections) {
  const notes = ["Base price taken from height/width matrix."];

  if (selections.doorType) {
    const optionLabel = doorTypeOptions.find((option) => option.value === selections.doorType)?.label ?? selections.doorType;
    notes.push(`Selected option: ${optionLabel}.`);
  }

  if (selections.lockType) {
    const hardwareLabel = lockTypeOptions.find((option) => option.value === selections.lockType)?.label ?? selections.lockType;
    notes.push(`Selected hardware: ${hardwareLabel}.`);
  }

  if (selections.handing) {
    notes.push(`Drawing selected for ${selections.handing}.`);
  }

  if (selections.colour) {
    notes.push(`Preview updated for ${selections.colour} finish.`);
  }

  return notes;
}

export async function getConfiguratorState(selections: ConfigSelections): Promise<ConfiguratorResponse> {
  const visibleFields: ConfigField[] = [
    {
      key: "leafType",
      label: "Leaf Type",
      type: "select",
      options: leafTypeOptions,
    },
  ];

  if (selections.leafType) {
    visibleFields.push({
      key: "handing",
      label: "Door Handing",
      type: "select",
      options: handingOptionsByLeafType[selections.leafType] ?? [],
    });
  }

  if (selections.handing) {
    visibleFields.push({
      key: "structuralHeight",
      label: "Structural Opening Height",
      type: "input",
      inputType: "number",
      options: [],
    });
  }

  if (selections.structuralHeight) {
    visibleFields.push({
      key: "structuralWidth",
      label: "Structural Opening Width",
      type: "input",
      inputType: "number",
      options: [],
    });
  }

  if (selections.structuralWidth) {
    visibleFields.push({
      key: "doorType",
      label: "Door Type",
      type: "select",
      options: doorTypeOptions,
    });
  }

  if (selections.doorType) {
    visibleFields.push({
      key: "lockType",
      label: "Lock Type",
      type: "select",
      options: lockTypeOptions,
    });
  }

  if (selections.lockType) {
    visibleFields.push({
      key: "colour",
      label: "Colour",
      type: "colour",
      options: colourOptions,
    });
  }

  const basePrice = getBasePrice(selections.leafType, selections.structuralHeight, selections.structuralWidth);
  const doorTypePrice = getMatrixAddonPrice(doorTypePrices, selections.doorType, selections.leafType);
  const lockTypePrice = getMatrixAddonPrice(lockTypePrices, selections.lockType, selections.leafType);
  const unitPrice = basePrice + doorTypePrice + lockTypePrice;

  const isComplete =
    Boolean(selections.leafType) &&
    Boolean(selections.handing) &&
    Boolean(selections.structuralHeight) &&
    Boolean(selections.structuralWidth) &&
    Boolean(selections.doorType) &&
    Boolean(selections.lockType) &&
    Boolean(selections.colour) &&
    basePrice > 0;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        visibleFields,
        isComplete,
        unitPrice,
        drawingLabel: buildDrawingLabel(selections),
        drawingUrl: buildDrawingUrl(selections),
        technicalNotes: getTechnicalNotes(selections),
      });
    }, 180);
  });
}