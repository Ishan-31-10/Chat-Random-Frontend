// Fake API functions (replace with real API later)
export const fetchStats = () => Promise.resolve({
users: 1200,
cars: 340,
bookings: 560,
revenue: 78000,
});


export const fetchUsers = () => Promise.resolve([
{ id: 1, name: "John Doe", email: "john@example.com" },
{ id: 2, name: "Jane Smith", email: "jane@example.com" },
]);


export const fetchCars = () => Promise.resolve([
{ id: 1, brand: "Tesla", model: "Model S" },
{ id: 2, brand: "BMW", model: "i8" },
]);


export const fetchBookings = () => Promise.resolve([
{ id: 1, user: "John Doe", car: "Tesla Model S", date: "2025-09-10" },
{ id: 2, user: "Jane Smith", car: "BMW i8", date: "2025-09-12" },
]);