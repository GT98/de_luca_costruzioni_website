export interface ImageData {
    id?: number;
    url: string;
    filename?: string;
    isCoverImg: boolean;
    order_index?: number;
    ristrutturazione_id?: number;
    stato?: string;
    created_at?: string;
    file?: File;
}