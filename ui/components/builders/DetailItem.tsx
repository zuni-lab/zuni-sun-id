import { cx } from "@/utils/tools";

export const DetailItem: IComponent<{
  title: string;
  value: string;
  link?: string;
  valueClassname?: string;
}> = ({ title, value, link, valueClassname }) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="w-32 uppercase font-bold  text-gray-600 text-sm">{title}</div>
      <div className={cx("w-1/2 font-semibold text-gray-800", valueClassname)}>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );
};
