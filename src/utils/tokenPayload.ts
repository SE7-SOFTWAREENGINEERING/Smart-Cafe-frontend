export const TOKEN_PAYLOAD_PREFIX = "SC_TOKEN:";

export type TokenPayloadItem = {
  name: string;
  quantity: number;
  price: number;
};

export type TokenPayload = {
  v: 1;
  bookingId?: string;
  tokenNumber?: string;
  slotTime?: string;
  slotDate?: string;
  totalAmount?: number;
  status?: string;
  expiryAt?: string;
  items?: TokenPayloadItem[];
};

const toBase64 = (value: string) => {
  const encoded = encodeURIComponent(value).replace(
    /%([0-9A-F]{2})/g,
    (_, hex) => String.fromCharCode(parseInt(hex, 16)),
  );
  return btoa(encoded);
};

const fromBase64 = (value: string) => {
  const decoded = atob(value)
    .split("")
    .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
    .join("");
  return decodeURIComponent(decoded);
};

export const encodeTokenPayload = (payload: TokenPayload) => {
  const json = JSON.stringify(payload);
  return `${TOKEN_PAYLOAD_PREFIX}${toBase64(json)}`;
};

export const decodeTokenPayload = (value?: string) => {
  if (!value) return null;
  if (!value.startsWith(TOKEN_PAYLOAD_PREFIX)) return null;
  const base64 = value.slice(TOKEN_PAYLOAD_PREFIX.length);
  try {
    const json = fromBase64(base64);
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
};
