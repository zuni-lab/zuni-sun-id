// @ts-expect-error - no types for tronweb
import TronWeb from 'tronweb';

export const tronWeb = new TronWeb({
  fullHost: 'https://api.shasta.trongrid.io',
});
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).tronWeb1 = tronWeb;
}
