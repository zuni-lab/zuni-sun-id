export const RuleItem: IComponent<{
  type: string;
  name: string;
}> = ({ type, name }) => {
  return (
    <div className="flex gap-1 rounded-md overflow-hidden text-white">
      <div className="w-2/5 bg-main flex items-center px-4 font-semibold uppercase">{type}</div>
      <div className="w-3/5 p-2 bg-gray-700">
        <div className=" font-bold">{name}</div>
      </div>
    </div>
  );
};
