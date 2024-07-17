import React from "react";
import { Section28_1 } from "api_v2/interfaces/civil";

interface Section28_1Props {
  data: Section28_1[];
  onInputChange: (path: string, value: any) => void;
  onRemoveEntry: (path: string, index: number) => void;
  onAddEntry: (path: string, newItem: Section28_1) => void;
  path: string;
  isReadOnlyField: (fieldName: string) => boolean;
  getDefaultNewItem: (itemType: string) => any;
}

const RenderSection28_1: React.FC<Section28_1Props> = ({
  data,
  onInputChange,
  onRemoveEntry,
  onAddEntry,
  getDefaultNewItem,
  path,
  isReadOnlyField,
}) => {
  const handleInputChange =
    (index: number, fieldPath: string) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      onInputChange(`${path}.section28_1[${index}].${fieldPath}`, value);
    };

  const renderEntry = (item: Section28_1, index: number) => (
    <div key={index} className="space-y-4 p-4 border rounded-lg">
      <h3>Entry #{index + 1}</h3>

     

      <button
        onClick={(event) => {
          event.preventDefault();
          onRemoveEntry(`${path}.section28_1`, index);
        }}
        disabled={isReadOnlyField(`section28_1[${index}].remove`)}
      >
        Remove Entry
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2>Section 27.3</h2>
      {data.map((item, index) => renderEntry(item, index))}
      <button
        onClick={(event) => {
          event.preventDefault();
          onAddEntry(
            `${path}.section28_1`,
            getDefaultNewItem(`${path}.section28_1`)
          );
        }}
      >
        Add Entry
      </button>
    </div>
  );
};

export { RenderSection28_1 };
