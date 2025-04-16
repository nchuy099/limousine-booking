export interface Location {
    id: string;
    name: string;
    code: string;
}

export interface Sublocation {
    id: string;
    name: string;
    locationCode: string;
    address: string;
    durationFromLocation: number;
}

export type VehicleCapacity = 'Standard-34' | 'VIP-20';

export interface Vehicle {
    id: string;
    licensePlate: string;
    capacity: VehicleCapacity;
}

export interface Trip {
    id: string;
    departureTime: string;
    arrivalTime: string;
    originLocationCode: string;
    destinationLocationCode: string;
    vehicleLicensePlate: string;
    status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    type: 'STANDARD' | 'VIP';
    price: number;
} 