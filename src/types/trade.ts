export interface Trade {
  id: number;
  created_at: string;
  client_id: string;
  device: string;
  status: string;
  lot: number;
  balance: number | null;
}