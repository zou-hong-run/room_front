import { UserItemResultType } from '@/api/system/user/types';
import { MeetingItemResultType } from '../meeting/types';

export interface BookingListParamType {
  user_name: string;
  meeting_name: string;
  meeting_position: string;
  range_start_date: Date | string;
  range_start_time: Date | string;
  range_end_date: Date | string;
  range_end_time: Date | string;
}
export interface BookingListResultType {
  bookings: BookingItemResultType[];
  totalCount: number;
}
export interface BookingItemResultType {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  note: string;
  createTime: string;
  updateTime: string;
  user: Partial<UserItemResultType>;
  meeting: Partial<MeetingItemResultType>;
}

export interface CreateBookingParamType {
  meeting_id: number;
  range_start_date: number;
  range_start_time: number;
  range_end_date: number;
  range_end_time: number;
  note: string;
}
