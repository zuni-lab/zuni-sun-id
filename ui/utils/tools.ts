import classNames from 'classnames';
// timeUtils.ts
import { formatDistanceToNow } from 'date-fns';
import moment from 'moment';
//@ts-expect-error - no types for tronweb
import TronWeb from 'tronweb';

/**
 * Mapping hotkey into className package for better usage
 */
export const cx: typeof classNames = classNames;

export const formatWalletAddress = (address: string) => {
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
};

export const getFomattedTimeAndDate = (inputDate: string | number) => {
  const date = moment(inputDate);
  const formattedDate = date.format('HH:mm Do MMM');
  return date.isValid() ? formattedDate : 'Never';
};

export const getForrmattedFullDate = (inputDate: string | number) => {
  const date = moment(inputDate).utc();
  const formattedDate = date.format('HH:mm Do MMM YYYY');
  return date.isValid() ? formattedDate : 'Never';
};

// HH, DD/MM/YYYY
export const getFormattedDate = (inputDate: string | number) => {
  const date = moment(inputDate);
  const formattedDate = date.format('DD-MM-YYYY');
  return date.isValid() ? formattedDate : 'Never';
};

export const toUtcTime = (date: Date) => {
  const time = new Date(date);
  time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
  return time;
};

export const getRelativeTime = (unixTimestamp: number): string => {
  const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
  return formatDistanceToNow(date, { addSuffix: true });
};

// hex
export const isValidBytes = (val: string) => {
  return /^0x([0-9a-fA-F]{2})+$/.test(val);
};

export const isValidBytesWithLength = (val: string, length: number) => {
  return new RegExp(`^0x([0-9a-fA-F]{${length * 2}})$`).test(val);
};

export const isValidAddress = (val: string) => {
  return isValidBytesWithLength(val, 20);
};

const FLOAT_REGEX = /^[+-]?([0-9]*[.])?[0-9]+$/;
export const isValidFloat = (val: string) => {
  return FLOAT_REGEX.test(val);
};

export const hexToNumber = (hex: bigint | undefined) => {
  //
  return hex ? parseInt((hex as any)._hex, 16) : 0;
};

export const isZeroAddress = (address: string) => {
  return (
    address === '410000000000000000000000000000000000000000' ||
    address === '0x0000000000000000000000000000000000000000' ||
    address === 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb'
  );
};

export const EMPTY_UID = '0x0000000000000000000000000000000000000000000000000000000000000000';

export const toTronAddress = (hexAddr: string) => TronWeb.address.fromHex(hexAddr) as string;
export const toHexAddress = (tronAddr: string) =>
  TronWeb.address.toHex(tronAddr).replace('41', '0x') as `0x${string}`;

export const isTronAddress = (address: string) => {
  return TronWeb.isAddress(address);
};

// Formats the balance to 2 decimal places and adds commas for large numbers
export const formatBalance = (balance: number | undefined, decimals = 6): string => {
  if (balance === undefined) return '--'; // Handle undefined balance
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(balance / Math.pow(10, decimals));
};

export const isCredentialValid = (revocationTime: number, expirationTime: number) => {
  return (
    (revocationTime == 0 || revocationTime > new Date().getTime()) &&
    (expirationTime == 0 || expirationTime > new Date().getTime())
  );
};
