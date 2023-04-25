import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { create } from 'ipfs-http-client'
import { css } from "@emotion/css"
import "easymde/dist/easymde.min.css"

const hiddenInput = css`
  display: none;
`

const coverImageStyle = css`
  max-width: 800px;
`

const mdEditor = css`
  margin-top: 40px;
`

const titleStyle = css`
  margin-top: 40px;
  border: none;
  outline: none;
  background-color: inherit;
  font-size: 44px;
  font-weight: 600;
  &::placeholder {
    color: #999999;
  }
`

const container = css`
  width: 800px;
  margin: 0 auto;
`

const button = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 18px;
  padding: 16px 70px;
  box-shadow: 7px 7px rgba(0, 0, 0, .1);
`

const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })

client.add('hello world')

const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { ssr: false }
)

const initialState = { title: '', content: '' }

export default function CreatePost() {
  const [post, setPost] = useState(initialState)
  const [image, setImage] = useState<File | null>(null)
  const [loaded, setLoaded] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }

  function triggerOnChange() {
    fileRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = e.target.files?.[0]
    console.log(`uploadedFile`, uploadedFile)
    if (!uploadedFile) return

    const added = await client.add(uploadedFile)

    setPost(state => ({ ...state, coverImage: added.path }))
    setImage(uploadedFile)
  }

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
    }, 500)
  }, [])

  return (
    <div className={container}>
      {image && <img className={coverImageStyle} src={URL.createObjectURL(image)} />}
      <input
        onChange={onChange}
        name='title'
        placeholder='Give it a title ...'
        value={post.title}
        className={titleStyle}
      />
      <SimpleMDE
        className={mdEditor}
        placeholder="What's on your mind?"
        value={post.content}
        onChange={value => setPost({ ...post, content: value })}
      />
      {loaded && (
        <>
          <button
            className={button}
            type='button'
          // onClick={createNewPost}
          >
            Publish
          </button>
          <button
            onClick={triggerOnChange}
            className={button}
          >
            Add cover image
          </button>
        </>
      )}
      <input
        id="selectImage"
        className={hiddenInput}
        type="file"
        onChange={handleFileChange}
        ref={fileRef}
      />
    </div>
  )
}