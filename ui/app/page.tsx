import { Button } from '@/components/shadcn/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/shadcn/Table';
import { MOCK_PRESENTABLE_SCHEMA, MOCK_STATS } from '@/constants/mock';
import { RouterMeta } from '@/constants/router';
import { Metadata } from 'next';

export const metadata: Metadata = RouterMeta.Home;

export default function Page() {
  return (
    <main className="py-12 space-y-4">
      <section className="flex items-center gap-12">
        <div>
          <h1>Stats</h1>
        </div>
        <div className="grow flex items-center justify-around gap-4 divide-x divide-white">
          {MOCK_STATS.map((stat, i) => (
            <div className="px-4" key={i}>
              {stat}
            </div>
          ))}
        </div>
        <Button>Make claim</Button>
      </section>
      <section>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>UUID</TableHead>
              <TableHead>Schema</TableHead>
              <TableHead>Resolver Address</TableHead>
              <TableHead>Claims</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PRESENTABLE_SCHEMA.map(
              ({ id, uuid, schema, resolverAddresss, numberOfClaims }) => (
                <TableRow key={uuid}>
                  <TableCell>
                    <Button className="bg-main/80 text-white py-1 px-2 w-fit h-fit hover:bg-main rounded-lg">
                      #{id}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="link" className="text-gray-200">
                      {uuid}
                    </Button>
                  </TableCell>
                  <TableCell className="w-120">
                    <ul className="flex flex-wrap gap-3">
                      {schema.map(({ token, type }) => (
                        <li
                          key={token}
                          className="py-1 px-4 border-radius bg-black w-fit rounded-md flex flex-col border">
                          <span className="uppercase text-[10px] text-gray-400 font-medium">
                            {type}
                          </span>
                          <span className="font-semibold">{token}</span>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{resolverAddresss}</TableCell>
                  <TableCell>{numberOfClaims}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <p className="text-center">View more</p>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
      <section></section>
    </main>
  );
}
