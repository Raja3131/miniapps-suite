import "./globals.css"

export const metadata = { title: "mini-__APP_NUM__-__APP_SLUG__", description: "" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
