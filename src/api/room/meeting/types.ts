export interface MeetingItemResultType {
  id: number;
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
  is_booked: boolean;
  create_time: string;
  update_time: string;
}
export interface MeetingListResultType {
  meetings: MeetingItemResultType[];
  totalCount: number;
}

export interface CreateMeetingParamType {
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
}
export interface UpdateMeetingParamType extends CreateMeetingParamType {
  id: number;
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
}
export type CreateMeetingResultType = string;
export type UpdateMeetingResultType = string;
export type DeleteMeetingResultType = string;
