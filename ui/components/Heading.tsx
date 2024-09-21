export const Heading: IComponent<{
  title: string;
  descs?: string[];
}> = ({ title, descs }) => {
  return (
    <div className="bg-[#fafafa] h-64 flex flex-col justify-center items-center text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">{title}</h1>
      {
        <div className="text-lg text-muted-foreground max-w-2xl">
          {descs?.map((desc, i) => <p key={i}>{desc}</p>)}
        </div>
      }
    </div>
  );
};
