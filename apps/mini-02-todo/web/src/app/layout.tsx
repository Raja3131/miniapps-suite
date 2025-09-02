import "./globals.css"

export const metadata = { title: "mini-02-todo", description: "" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
