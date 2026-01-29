declare module "qrcode" {
  interface QRCodeOptions {
    margin?: number;
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  function toDataURL(text: string, options?: QRCodeOptions): Promise<string>;

  export default { toDataURL };
}
