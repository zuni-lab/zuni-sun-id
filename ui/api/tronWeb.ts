// @ts-expect-error - no types for tronweb
import TronWeb from 'tronweb';

const MOCK_PRIVATE_KEY = '0000000000000000000000000000000000000000000000000000000000000001';

export const tronWeb = new TronWeb({
  fullHost: 'https://api.shasta.trongrid.io',
  privateKey: MOCK_PRIVATE_KEY,
});
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).tronWeb1 = tronWeb;
}
