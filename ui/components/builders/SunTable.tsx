import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/Table';
import { Button } from '../shadcn/Button';

export const SunTable: IComponent<{
  title: string;
  columns: { label: string; className?: string }[];
  data: any[];
  renderRow: (row: any, index: number) => JSX.Element;
  footerButton: string;
  renderRightTop?: JSX.Element;
}> = ({ title, columns, data, renderRow, footerButton, renderRightTop }) => (
  <section>
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-medium my-2 mb-4">{title}</h1>
      {renderRightTop}
    </div>
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          {columns.map((col, index) => (
            <TableHead key={index} className={col.className}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{data.map(renderRow)}</TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={columns.length}>
            <Button className="w-full" variant="link">
              {footerButton}
            </Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  </section>
);
