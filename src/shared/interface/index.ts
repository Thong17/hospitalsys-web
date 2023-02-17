export declare type StatusType = 'SUCCESS' | 'LOADING' | 'FAILED' | 'INIT'
export interface IBody<T> {
  data: T
  status: StatusType
  count?: number
  hasMore?: boolean
}

export declare type StructureStatusType = 'vacant' | 'occupied' | 'reserved'
export declare type StructureSizeType = 'small' | 'medium' | 'large'
export declare type StructureDirectionType = 'row' | 'column'