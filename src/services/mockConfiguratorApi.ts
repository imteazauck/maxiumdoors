export type ConfigFieldKey =
  | "doorType"
  | "handing"
  | "height"
  | "widthBand"
  | "exactWidth"
  | "lockType"
  | "colour";

export type ConfigField = {
  key: ConfigFieldKey;
  label: string;
  options: { value: string; label: string }[];
};

export type ConfigSelections = Partial<Record<ConfigFieldKey, string>>;

export type ConfiguratorResponse = {
  visibleFields: ConfigField[];
  nextFieldKey?: ConfigFieldKey;
  isComplete: boolean;
  unitPrice: number;
  drawingLabel: string;
  technicalNotes: string[];
};

const fieldDefinitions: Record<ConfigFieldKey, ConfigField> = {
  doorType: {
    key: "doorType",
    label: "Door Type",
    options: [
      { value: "standard-single", label: "Standard Single" },
      { value: "standard-double", label: "Standard Double" },
      { value: "vision-single", label: "Vision Single" },
      { value: "louvre-single", label: "Louvre Single" },
    ],
  },
  handing: {
    key: "handing",
    label: "Handing",
    options: [
      { value: "left-out", label: "Left Hand Out" },
      { value: "right-out", label: "Right Hand Out" },
      { value: "left-in", label: "Left Hand In" },
      { value: "right-in", label: "Right Hand In" },
    ],
  },
  height: {
    key: "height",
    label: "Structural Opening Height",
    options: [
      { value: "2000", label: "2000 mm" },
      { value: "2100", label: "2100 mm" },
      { value: "2200", label: "2200 mm" },
    ],
  },
  widthBand: {
    key: "widthBand",
    label: "Structural Opening Width",
    options: [
      { value: "700-1000", label: "700 - 1000 mm" },
      { value: "1001-1400", label: "1001 - 1400 mm" },
      { value: "1401-1800", label: "1401 - 1800 mm" },
    ],
  },
  exactWidth: {
    key: "exactWidth",
    label: "Exact Width",
    options: [
      { value: "762", label: "762 mm" },
      { value: "838", label: "838 mm" },
      { value: "914", label: "914 mm" },
      { value: "1000", label: "1000 mm" },
      { value: "1200", label: "1200 mm" },
      { value: "1500", label: "1500 mm" },
    ],
  },
  lockType: {
    key: "lockType",
    label: "Lock Type",
    options: [
      { value: "deadlock", label: "Deadlock" },
      { value: "sashlock", label: "Sashlock" },
      { value: "panic", label: "Panic Hardware" },
      { value: "codelock", label: "Codelock" },
    ],
  },
  colour: {
    key: "colour",
    label: "Colour",
    options: [
      { value: "traffic-white", label: "Traffic White" },
      { value: "anthracite", label: "Anthracite Grey" },
      { value: "jet-black", label: "Jet Black" },
      { value: "custom", label: "Custom RAL" },
    ],
  },
};

const fieldOrder: ConfigFieldKey[] = [
  "doorType",
  "handing",
  "height",
  "widthBand",
  "exactWidth",
  "lockType",
  "colour",
];

function getFilteredField(key: ConfigFieldKey, selections: ConfigSelections): ConfigField {
  if (key === "handing" && selections.doorType?.includes("double")) {
    return {
      ...fieldDefinitions.handing,
      options: [
        { value: "active-left", label: "Active Leaf Left" },
        { value: "active-right", label: "Active Leaf Right" },
      ],
    };
  }

  if (key === "lockType") {
    const isDouble = selections.doorType?.includes("double");
    const options = isDouble
      ? fieldDefinitions.lockType.options.filter((option) => option.value !== "codelock")
      : fieldDefinitions.lockType.options;
    return { ...fieldDefinitions.lockType, options };
  }

  if (key === "exactWidth") {
    const band = selections.widthBand;
    let options = fieldDefinitions.exactWidth.options;
    if (band === "700-1000") {
      options = options.filter((option) => ["762", "838", "914", "1000"].includes(option.value));
    } else if (band === "1001-1400") {
      options = options.filter((option) => ["1000", "1200"].includes(option.value));
    } else if (band === "1401-1800") {
      options = options.filter((option) => option.value === "1500");
    }
    return { ...fieldDefinitions.exactWidth, options };
  }

  return fieldDefinitions[key];
}

function labelFor(key: ConfigFieldKey, value?: string) {
  if (!value) return "—";
  const field = getFilteredField(key, {});
  return field.options.find((option) => option.value === value)?.label ?? value;
}

function buildTechnicalNotes(selections: ConfigSelections) {
  const notes = [
    "Frame, leaf, hinges and standard preparation are included in the quoted price.",
    "Door set supplied subject to confirmation of final structural opening and handing on approval.",
  ];

  switch (selections.lockType) {
    case "deadlock":
      notes.push("Deadlock supplied with euro profile cylinder and three keys.");
      break;
    case "sashlock":
      notes.push("Sashlock supplied with lever handles, cylinder and latch furniture.");
      break;
    case "panic":
      notes.push("Panic hardware includes push bar gear and emergency egress preparation.");
      break;
    case "codelock":
      notes.push("Codelock option includes digital access preparation and internal lever furniture.");
      break;
    default:
      break;
  }

  if (selections.doorType?.includes("louvre")) {
    notes.push("Louvre blades are factory fitted to the selected leaf arrangement.");
  }

  if (selections.colour === "custom") {
    notes.push("Custom RAL pricing is provisional pending finish confirmation.");
  }

  return notes;
}

function calculatePrice(selections: ConfigSelections) {
  let price = 695;

  if (selections.doorType === "standard-double") price += 520;
  if (selections.doorType === "vision-single") price += 180;
  if (selections.doorType === "louvre-single") price += 140;
  if (selections.height === "2100") price += 45;
  if (selections.height === "2200") price += 90;
  if (selections.widthBand === "1001-1400") price += 75;
  if (selections.widthBand === "1401-1800") price += 140;
  if (selections.lockType === "panic") price += 210;
  if (selections.lockType === "codelock") price += 160;
  if (selections.colour === "custom") price += 120;

  return price;
}

export async function getConfiguratorState(
  selections: ConfigSelections
): Promise<ConfiguratorResponse> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const visibleFields: ConfigField[] = [];
  let nextFieldKey: ConfigFieldKey | undefined;

  for (const key of fieldOrder) {
    visibleFields.push(getFilteredField(key, selections));
    if (!selections[key]) {
      nextFieldKey = key;
      break;
    }
  }

  const isComplete = fieldOrder.every((key) => Boolean(selections[key]));
  const unitPrice = calculatePrice(selections);

  const parts = [
    labelFor("doorType", selections.doorType),
    labelFor("handing", selections.handing),
    selections.exactWidth ? `${selections.exactWidth} mm` : undefined,
    selections.height ? `${selections.height} mm high` : undefined,
  ].filter(Boolean);

  return {
    visibleFields,
    nextFieldKey,
    isComplete,
    unitPrice,
    drawingLabel: parts.join(" • ") || "Choose a door type to begin the drawing preview.",
    technicalNotes: buildTechnicalNotes(selections),
  };
}
