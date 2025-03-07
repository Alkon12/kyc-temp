import 'bootstrap/dist/css/bootstrap.min.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '@/styles/globals.css'
import { ReactNode } from 'react'
import SiteHeader from '../components/(client-components)/(Header)/SiteHeader'
import Footer from '@/components/Footer'
import getCurrentUser from '../client/actions/getCurrentUser'
import { GoogleTagManager } from '@next/third-parties/google'
import { Poppins } from 'next/font/google'

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
  const currentUser = await getCurrentUser()
  const tagManager = process.env.GOOGLE_TAG_MANAGER as string

  return (
    <html lang="es-MX" className={poppins.className}>
      <head>
        <title>Autofin Rent</title>
        {/*
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-TCZCLTS4');`,
            }}
          ></script>
        */}
      </head>
      <body>
        {tagManager && tagManager !== '' && <GoogleTagManager gtmId={tagManager} />}
        {/*
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TCZCLTS4" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          ></noscript>
        */}
        <SiteHeader currentUser={currentUser} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
