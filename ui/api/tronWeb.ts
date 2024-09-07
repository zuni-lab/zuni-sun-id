// @ts-expect-error - no types for tronweb
import TronWeb from 'tronweb';

export const tronWeb: any = new TronWeb({
  fullHost: 'https://api.shasta.trongrid.io',
});
if (typeof window !== 'undefined') {
  (window as any).tronWeb1 = tronWeb;
}
