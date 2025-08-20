import { MessageType } from "./chatTypes";

export type StatusTitle = 'Not addressed' | 'In progress' | 'Addressed';
export type IStatus = 'addressed' | 'inProgress' | 'notAddressed';

export interface Observation {
  conversationId: {
    messages: MessageType[]
  }
  _id: string;
  name: string;

  projectId: string;
  photoList: string[];
  x: number;
  y: number;
  status: StatusTitle;
  implementedActions: string;
  hazardIdentified: string;
  isPublished: boolean;
  createdAt: Date; // or Date if using date objects
  updatedAt: Date; // or Date if using date objects
  text: string
  //TODO 342
  locationComment?: string

  location?: string
  subContractor?: string
  closedDate?: Date
  followUp?: string

  generalContractor?: string;

  reporter?: string;
  note?: string;
  contractor?: string;

  category?: string[];
  categories?: {
    links: string[];
    name: string;
    specification: string;
  }[];
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  deadline?: Date;
  assignees?: {
    _id: string;
    name: string;
    email: string;
  }[];
}

export interface ObservationsResponse {
  observations: Observation[];
  count: number;
  addressedCount: number;
  inProgressCount: number;
  notAddressedCount: number;
}
