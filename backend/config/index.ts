export const SMTP_ADDRESS =
    process.env.SMTP_ADDRESS ?? "cluster5out.us.messagelabs.com";
export const SMTP_EMAIL = process.env.SMTP_EMAIL ?? "AfricaRicehhr@cgiar.org";
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD ?? "P@ss2020Rh#";
export const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "25") ?? 25;
