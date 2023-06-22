export function Separator({ title }: { title: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-start">
        <span className="bg-base-100 pr-3 text-xl font-semibold leading-6">
          {title}
        </span>
      </div>
    </div>
  );
}
