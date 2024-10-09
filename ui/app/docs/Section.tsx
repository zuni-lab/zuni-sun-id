export const Section: IComponent<{
    title?: string;
    descs?: string[];
  }> = ({ title, descs }) => {
    return (
      <div className="space-y-2 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="text-gray-700 text-lg">{descs?.map((desc, i) => <p key={i}>{desc}</p>)}</div>
      </div>
    );
  };