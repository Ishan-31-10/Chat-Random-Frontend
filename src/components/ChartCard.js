import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


const data = [
{ name: "Jan", revenue: 4000 },
{ name: "Feb", revenue: 3000 },
{ name: "Mar", revenue: 2000 },
{ name: "Apr", revenue: 2780 },
{ name: "May", revenue: 1890 },
{ name: "Jun", revenue: 2390 },
];


export default function ChartCard() {
return (
<div className="bg-white p-6 rounded-lg shadow-md">
<h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
<ResponsiveContainer width="100%" height={300}>
<LineChart data={data}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
</LineChart>
</ResponsiveContainer>
</div>
);
}