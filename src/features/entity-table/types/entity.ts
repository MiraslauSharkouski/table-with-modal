// Define the basic entity type for our table
export interface Entity {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  status?: "active" | "inactive" | "pending";
}

// Define the form data type for the modal
export interface EntityFormData {
  name: string;
  description: string;
  status: "active" | "inactive" | "pending";
}
