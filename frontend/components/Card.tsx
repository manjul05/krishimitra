type CardProps = {
  title: string;
  description: string;
};

export default function Card({ title, description }: CardProps) {
  return (
    <div className="rounded-lg border border-green-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <h3 className="mb-3 text-xl font-semibold text-green-700">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
