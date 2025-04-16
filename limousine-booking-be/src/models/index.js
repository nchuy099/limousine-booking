// associations.js
const User = require('./user');
const Profile = require('./profile');
const Booking = require('./booking');
const Seat = require('./seat');
const VehicleSeatConfig = require('./vehicleSeatConfig');
const Vehicle = require('./vehicle');
const Trip = require('./trip');
const Post = require('./post');
const SubLocation = require('./sublocation');
const Location = require('./location');


// User associations
User.belongsTo(Profile, {
    foreignKey: 'profileId',
    as: 'profile'
});
User.hasMany(Post, {
    foreignKey: 'userId',
    as: 'posts'
});

// Profile associations
Profile.hasOne(User, {
    foreignKey: 'profileId',
    as: 'user'
});
Profile.hasMany(Booking, {
    foreignKey: 'profileId',
    as: 'bookings'
});

// Booking associations
Booking.belongsTo(Profile, {
    foreignKey: 'profileId',
    as: 'profile'
});
Booking.belongsTo(Seat, {
    foreignKey: 'seatId',
    as: 'seat'
});
Booking.belongsTo(SubLocation, {
    foreignKey: 'subOriginId',
    as: 'subOrigin'
});
Booking.belongsTo(SubLocation, {
    foreignKey: 'subDestinationId',
    as: 'subDestination'
});

// Seat associations
Seat.hasMany(Booking, {
    foreignKey: 'seatId',
    as: 'bookings'
});
Seat.belongsTo(Trip, {
    foreignKey: 'tripId',
    as: 'trip'
});

// VehicleSeatConfig associations
VehicleSeatConfig.belongsTo(Vehicle, {
    foreignKey: 'vehicleId',
    as: 'vehicle'
});

// Vehicle associations
Vehicle.hasMany(VehicleSeatConfig, {
    foreignKey: 'vehicleId',
    as: 'seatConfigs'
});
Vehicle.hasMany(Trip, {
    foreignKey: 'vehicleId',
    as: 'trips'
});

// Trip associations
Trip.belongsTo(Vehicle, {
    foreignKey: 'vehicleId',
    as: 'vehicle'
});
Trip.hasMany(Seat, {
    foreignKey: 'tripId',
    as: 'seats'
});
Trip.belongsTo(Location, { foreignKey: 'originLocationId', as: 'origin' });
Trip.belongsTo(Location, { foreignKey: 'destinationLocationId', as: 'destination' });

// Location associations
Location.hasMany(SubLocation, { foreignKey: 'locationId', as: 'subLocations' });
Location.hasMany(Trip, { foreignKey: 'originLocationId', as: 'originTrips' });
Location.hasMany(Trip, { foreignKey: 'destinationLocationId', as: 'destinationTrips' });

// SubLocation associations
SubLocation.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });
SubLocation.hasMany(Booking, { foreignKey: 'subOriginId', as: 'subOriginBookings' });
SubLocation.hasMany(Booking, { foreignKey: 'subDestinationId', as: 'subDestinationBookings' });


module.exports = {
    User,
    Profile,
    Booking,
    Seat,
    VehicleSeatConfig,
    Vehicle,
    Trip,
    Post,
    SubLocation,
    Location
}