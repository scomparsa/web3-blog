import type { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { css } from '@emotion/css'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal, Web3Button } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig, useAccount } from 'wagmi'
import { localhost } from 'wagmi/chains'
import { useMounted } from '../hooks/use-mounted'
import { AccountContext } from '../context'
import { ownerAddress } from '../config'
import '@/styles/globals.css'

const container = css`
  padding: 40px;
`

const nav = css`
  background-color: #fff;
`

const header = css`
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,.075);
  padding: 20px 30px;
`

const titleContainer = css`
  display: flex;
  flex-direction: column;
  padding-left: 15px;
`

const title = css`
  margin-left: 30px;
  font-weight: 500;
  margin: 0;
`

const description = css`
  margin: 0;
  color: #999999;
`

const accountInfo = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-size: 12px;
`

const buttonContainer = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
`

const linkContainer = css`
  padding: 30px 60px;
  background-color: #fafafa;
`

const link = css`
  margin: 0px 40px 0px 0px;
  font-size: 16px;
  font-weight: 400;
`

const inter = Inter({ subsets: ['latin'] })
const chains = [localhost]
const { provider } = configureChains(chains, [w3mProvider({ projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string })])
const wagmiClient = createClient({
  provider,
  autoConnect: true,
  connectors: w3mConnectors({ chains, version: 1, projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string })
})
const ethereumClient = new EthereumClient(wagmiClient, chains)

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useMounted()
  const { address: account } = useAccount()

  return (
    <main className={inter.className}>
      <Head>
        <title>Web3 Blog</title>
        <link rel="icon" href="/logo.svg" sizes="any" type="image/svg+xml"></link>
      </Head>
      <WagmiConfig client={wagmiClient}>
        <nav className={nav}>
          <div className={header}>
            <Link href="/">
              <img src="/logo.svg" alt="logo" style={{ width: 50 }} />
            </Link>
            <Link href="/">
              <div className={titleContainer}>
                <h2 className={title}>Full Stack</h2>
                <p className={description}>WEB3</p>
              </div>
            </Link>
            <div className={buttonContainer}>
              <Web3Button />
            </div>
          </div>
          <div className={linkContainer}>
            <Link href="/" className={link}>Home</Link>
            {isMounted && account === ownerAddress && <Link href="/create-post" className={link}>
              Create Post
            </Link>}
          </div>
        </nav>
        <div className={container}>
          <AccountContext.Provider value={account}>
            <Component {...pageProps} />
          </AccountContext.Provider>
        </div>
        <Web3Modal projectId={process.env.NEXT_PUBLIC_PROJECT_ID as string} ethereumClient={ethereumClient} />
      </WagmiConfig>
    </main>
  )
}
