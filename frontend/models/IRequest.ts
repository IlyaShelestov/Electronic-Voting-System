export interface IRequest {
    request_id: number,
    field_name: string,
    old_value: string,
    new_value: string,
    status: string,
    created_at: string,
    updated_at: string
}