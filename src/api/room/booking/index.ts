import request, { Response } from '@/utils/request';
import dayjs from 'dayjs';
import {
  BookingListParamType,
  BookingListResultType,
  CreateBookingParamType,
} from './types';

export const bookingList = (
  param: BookingListParamType,
  page_no: number,
  page_size: number,
) => {
  let booking_time_range_start;
  let booking_time_range_end;

  if (param.range_start_date && param.range_start_time) {
    const range_start_dateStr = dayjs(param.range_start_date).format(
      'YYYY-MM-DD',
    );
    const range_start_timeStr = dayjs(param.range_start_time).format('HH:mm');
    booking_time_range_start = dayjs(
      range_start_dateStr + ' ' + range_start_timeStr,
    ).valueOf();
  }
  if (param.range_end_date && param.range_end_time) {
    const range_end_dateStr = dayjs(param.range_end_date).format('YYYY-MM-DD');
    const range_end_timeStr = dayjs(param.range_end_time).format('HH:mm');
    booking_time_range_end = dayjs(
      range_end_dateStr + ' ' + range_end_timeStr,
    ).valueOf();
  }
  return request<any, Response<BookingListResultType>>({
    method: 'get',
    url: '/booking/list',
    params: {
      page_no,
      page_size,
      user_name: param.user_name,
      meeting_name: param.meeting_name,
      meeting_position: param.meeting_position,
      booking_time_range_start,
      booking_time_range_end,
    },
  });
};

export const apply = (id: number) => {
  return request<any, Response<string>>({
    method: 'get',
    url: '/booking/apply/' + id,
  });
};

export const reject = (id: number) => {
  return request<any, Response<string>>({
    method: 'get',
    url: '/booking/reject/' + id,
  });
};

export const unbind = (id: number) => {
  return request<any, Response<string>>({
    method: 'get',
    url: '/booking/unbind/' + id,
  });
};

export const addBooking = (param: CreateBookingParamType) => {
  const rangeStartDateStr = dayjs(param.range_start_date).format('YYYY-MM-DD');
  const rangeStartTimeStrt = dayjs(param.range_start_time).format('HH:mm');
  const start_time = dayjs(
    rangeStartDateStr + ' ' + rangeStartTimeStrt,
  ).valueOf();
  const rangeEndDateStr = dayjs(param.range_end_date).format('YYYY-MM-DD');
  const rangeEndTimeStrt = dayjs(param.range_end_time).format('HH:mm');
  const end_time = dayjs(rangeEndDateStr + ' ' + rangeEndTimeStrt).valueOf();
  return request<any, Response<string>>({
    method: 'post',
    url: '/booking/add',
    data: {
      meeting_id: param.meeting_id,
      start_time,
      end_time,
      note: param.note,
    },
  });
};
