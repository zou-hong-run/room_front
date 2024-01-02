export interface DeptResultType {
  id: number;
  dept_name: string;
  parent_id: number;
  create_time: string;
  update_time: string;
  remark: string;
}

export type DeptListResultType = DeptResultType[];

export interface CreateDeptParamType {
  dept_name: string;
  parent_id: number | null;
  remark: string;
}
export type CreateDeptResultType = string;
