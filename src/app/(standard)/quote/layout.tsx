import 'bootstrap/dist/css/bootstrap.min.css'
import '@styles/globals.css'
import { ApolloWrapper } from '@app/ApolloWrapper'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <ApolloWrapper>{children}</ApolloWrapper>
}
