export interface CreateContact {
  name: string;
  email?: string;
  description?: string;
  phone?: string;
  birthday?: Date;
  address?: string;
  favorite?: boolean;
}
