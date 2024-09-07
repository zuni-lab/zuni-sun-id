const colors = [
  'bg-main',
  'bg-border',
  'bg-input',
  'bg-ring',
  'bg-background',
  'bg-foreground',
  'bg-primary',
  'bg-primary-foreground',
  'bg-secondary',
  'bg-secondary-foreground',
  'bg-destructive',
  'bg-destructive-foreground',
  'bg-muted',
  'bg-muted-foreground',
  'bg-accent',
  'bg-accent-foreground',
  'bg-popover',
  'bg-popover-foreground',
  'bg-card',
  'bg-card-foreground',
];

export const ColorPalette: IComponent = () => {
  return (
    <div className="grid grid-cols-10 gap-2 bg-gray-300">
      {colors.map((color) => (
        <div
          key={color}
          className={`flex flex-col items-center justify-center p-4 rounded-lg ${color}`}>
          <span className="text-fuchsia-500">{color}</span>
        </div>
      ))}
    </div>
  );
};
