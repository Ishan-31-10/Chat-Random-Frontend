export default function StatCard({ title, value }) {
return (
<div className="bg-white p-6 rounded-lg shadow-md text-center">
<h3 className="text-gray-600 text-sm mb-2">{title}</h3>
<p className="text-2xl font-bold">{value}</p>
</div>
);
}