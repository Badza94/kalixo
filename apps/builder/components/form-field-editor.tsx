"use client";

import { useState } from "react";
import { FormField } from "../types/form";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Plus, Trash2 } from "@workspace/ui/lucide-react";

interface FormFieldEditorProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

export function FormFieldEditor({ fields, onChange }: FormFieldEditorProps) {
  const [editingField, setEditingField] = useState<FormField | null>(null);

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: "text",
      label: "New Field",
      required: false,
    };
    onChange([...fields, newField]);
    setEditingField(newField);
  };

  const updateField = (updatedField: FormField) => {
    const updatedFields = fields.map((field) =>
      field.id === updatedField.id ? updatedField : field
    );
    onChange(updatedFields);
    setEditingField(null);
  };

  const deleteField = (fieldId: string) => {
    onChange(fields.filter((field) => field.id !== fieldId));
    if (editingField?.id === fieldId) {
      setEditingField(null);
    }
  };

  const fieldTypes = [
    { value: "text", label: "Text Input" },
    { value: "email", label: "Email" },
    { value: "tel", label: "Phone" },
    { value: "url", label: "URL" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "textarea", label: "Textarea" },
    { value: "select", label: "Dropdown" },
    { value: "radio", label: "Radio Buttons" },
    { value: "checkbox", label: "Checkboxes" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Form Fields</h3>
        <Button onClick={addField} size="sm" variant="outline">
          <Plus className="mr-2 w-4 h-4" />
          Add Field
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((field) => (
          <div key={field.id} className="p-3 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium">{field.label}</span>
                <span className="text-xs text-gray-500">({field.type})</span>
                {field.required && (
                  <span className="text-xs text-red-500">*</span>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingField(field)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteField(field.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingField && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h4 className="mb-3 text-sm font-medium">Edit Field</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="field-label">Label</Label>
              <Input
                id="field-label"
                value={editingField.label}
                onChange={(e) =>
                  setEditingField({ ...editingField, label: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="field-type">Type</Label>
              <Select
                value={editingField.type}
                onValueChange={(value: any) =>
                  setEditingField({ ...editingField, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={editingField.placeholder || ""}
                onChange={(e) =>
                  setEditingField({
                    ...editingField,
                    placeholder: e.target.value,
                  })
                }
              />
            </div>

            {(editingField.type === "select" ||
              editingField.type === "radio" ||
              editingField.type === "checkbox") && (
              <div>
                <Label htmlFor="field-options">Options (one per line)</Label>
                <Textarea
                  id="field-options"
                  value={editingField.options?.join("\n") || ""}
                  onChange={(e) =>
                    setEditingField({
                      ...editingField,
                      options: e.target.value
                        .split("\n")
                        .filter((opt) => opt.trim()),
                    })
                  }
                  rows={3}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="field-required"
                checked={editingField.required || false}
                onCheckedChange={(checked) =>
                  setEditingField({ ...editingField, required: !!checked })
                }
              />
              <Label htmlFor="field-required">Required field</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => updateField(editingField)} size="sm">
                Save
              </Button>
              <Button
                onClick={() => setEditingField(null)}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
