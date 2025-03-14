import '@/styles/globals.css'
import { ReactNode } from 'react'
import { Poppins } from 'next/font/google'
import Providers from "./providers";

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata = {
  title: 'Autofin Rent',
  description: 'Grupo Autofin Mexico',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  
  return (
    <html lang="es-MX" className={poppins.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
