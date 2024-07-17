import React from "react";
import { Section29_1 } from "api_v2/interfaces/association";

interface Section29_1Props {
  data: Section29_1[];
  onInputChange: (path: string, value: any) => void;
  onRemoveEntry: (path: string, index: number) => void;
  onAddEntry: (path: string, newItem: Section29_1) => void;
  path: string;
  isReadOnlyField: (fieldName: string) => boolean;
  getDefaultNewItem: (itemType: string) => any;
}

const RenderSection29_1: React.FC<Section29_1Props> = ({
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
      onInputChange(`${path}.section29_1[${index}].${fieldPath}`, value);
    };

  const renderEntry = (item: Section29_1, index: number) => (
    <div key={index} className="space-y-4 p-4 border rounded-lg">
      <h3>Entry #{index + 1}</h3>

     

      <button
        onClick={(event) => {
          event.preventDefault();
          onRemoveEntry(`${path}.section29_1`, index);
        }}
        disabled={isReadOnlyField(`section29_1[${index}].remove`)}
      >
        Remove Entry
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2>Section 29.1</h2>
      {data.map((item, index) => renderEntry(item, index))}
      <button
        onClick={(event) => {
          event.preventDefault();
          onAddEntry(
            `${path}.section29_1`,
            getDefaultNewItem(`${path}.section29_1`)
          );
        }}
      >
        Add Entry
      </button>
    </div>
  );
};

export { RenderSection29_1 };
