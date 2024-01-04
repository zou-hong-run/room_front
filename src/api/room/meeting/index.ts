import request, { Response } from '@/utils/request';
import {
  CreateMeetingParamType,
  CreateMeetingResultType,
  DeleteMeetingResultType,
  MeetingItemResultType,
  MeetingListResultType,
  UpdateMeetingParamType,
  UpdateMeetingResultType,
} from './types';

export const meetingList = (
  page_no?: number,
  page_size?: number,
  name?: string,
  capacity?: number,
  equipment?: string,
  location?: string,
  description?: string,
) => {
  return request<any, Response<MeetingListResultType>>({
    method: 'get',
    url: '/meeting/list',
    params: {
      page_no,
      page_size,
      name,
      capacity,
      equipment,
      location,
      description,
    },
  });
};
export const deleteMeeting = (id: number) => {
  return request<any, Response<DeleteMeetingResultType>>({
    method: 'delete',
    url: '/meeting/' + id,
  });
};
export const createMeeting = (meeting: CreateMeetingParamType) => {
  return request<any, Response<CreateMeetingResultType>>({
    method: 'post',
    url: '/meeting/create',
    data: meeting,
  });
};
export const updateMeeting = (meeting: UpdateMeetingParamType) => {
  return request<any, Response<UpdateMeetingResultType>>({
    method: 'patch',
    url: '/meeting/update',
    data: meeting,
  });
};

export const findMeeting = (id: number) => {
  return request<any, Response<MeetingItemResultType>>({
    method: 'get',
    url: '/meeting/' + id,
  });
};
