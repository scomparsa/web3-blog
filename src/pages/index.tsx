import { ethers } from "ethers"
import { css } from "@emotion/css"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import Blog from '~/artifacts/contracts/Blog.sol/Blog.json'
import { useMounted } from "../hooks/use-mounted"
import { contractAddress, ownerAddress } from "../config"
import { AccountContext } from '../context'

interface HomeProps {
  posts: string[]
}

const arrowContainer = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-right: 20px;
`

const postTitle = css`
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
  margin: 0;
  padding: 20px;
`

const linkStyle = css`
  border: 1px solid #ddd;
  margin-top: 20px;
  border-radius: 8px;
  display: flex;
`

const postList = css`
  width: 700px;
  margin: 0 auto;
  padding-top: 50px;  
`

const container = css`
  display: flex;
  justify-content: center;
`

const buttonStyle = css`
  margin-top: 100px;
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 44px;
  padding: 20px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, .1);
`

const arrow = css`
  width: 35px;
  margin-left: 30px;
`

const smallArrow = css`
  width: 25px;
`

export default function Home({ posts }: HomeProps) {
  const account = useContext(AccountContext)
  const router = useRouter()
  const isMounted = useMounted()

  async function navigate() {
    router.push('/create-post')
  }

  return (
    <>
      <div className={postList}>
        {posts.map((post, idx) => (
          <Link href={`/post/${post[2]}`} key={idx}>
            <div className={linkStyle}>
              <p className={postTitle}>{post[1]}</p>
              <div className={arrowContainer}>
                <img
                  src='/right-arrow.svg'
                  alt='right arrow'
                  className={smallArrow}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className={container}>
        {isMounted && account === ownerAddress && !posts?.length && (
          <button className={buttonStyle} onClick={navigate}>
            Create your first post
            <img
              src='/right-arrow.svg'
              alt='right arrow'
              className={arrow}
            />
          </button>
        )}
      </div>
    </>
  )
}

export async function getServerSideProps() {
  let provider

  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
    provider = new ethers.providers.JsonRpcProvider()
  } else if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'testnet') {
    provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today')
  } else {
    provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/')
  }

  const contract = new ethers.Contract(contractAddress, Blog.abi, provider)
  const data = [] // await contract.fetchPosts()

  return {
    props: {
      posts: JSON.parse(JSON.stringify(data))
    }
  }
}