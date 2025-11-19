export interface GetTicketsCostsResponse {
  flights: Flight[];
}

export interface Flight {
  airline: string;
  flightNumber: string;
  price: number;
}