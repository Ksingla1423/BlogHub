import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button, Input, RTE, Select } from '../index'
import appwriteService from '../../appwrite/config'
import { useSelector } from 'react-redux'

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || '',
      slug: post?.$id || '',
      content: post?.content || '',
      status: post?.status || 'active',
    },
  })

  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData)
  const [loading, setLoading] = useState(false)

  const submit = async (data) => {
    setLoading(true)
    if (post) {
      const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null

      if (file) {
        appwriteService.deleteFile(post.featuredImage)
      }

      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : post.featuredImage,
      })

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`)
      }
    } else {
      const file = await appwriteService.uploadFile(data.image[0])

      if (file) {
        const fileId = file.$id
        data.featuredImage = fileId
        const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id })
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`)
        }
      }
    }
    setLoading(false)
  }

  const slugTransform = (value) => {
    if (value && typeof value === 'string')
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, '-')
        .replace(/\s/g, '-')

    return ''
  }

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        setValue('slug', slugTransform(value.title, { shouldValidate: true }))
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, setValue])

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          {...register('title', { required: true })}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Slug :"
          placeholder="Slug"
          {...register('slug', { required: true })}
          onInput={(e) => {
            setValue('slug', slugTransform(e.currentTarget.value), { shouldValidate: true })
          }}
        />
      </div>
      <div className="w-full px-2">
        <RTE label="Content :" name="content" control={control} defaultValue={getValues('content')} />
      </div>
      <div className="w-1/3 px-2">
        <Select
          options={['active', 'inactive']}
          label="Status"
          {...register('status', { required: true })}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register('image', { required: !post })}
        />
      </div>
      <div className="w-full px-2">
        <Button
          type="submit"
          bgColor={post ? 'bg-green-500' : 'bg-blue-500'}
          className="w-full"
          disabled={loading}
        >
          {post ? 'Update' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}

export default PostForm
