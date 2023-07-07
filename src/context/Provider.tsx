import React, { createContext, useEffect, useState, useMemo } from 'react'
import _ from 'lodash'

export interface UserInfoProps {
  currentUserId: string
  currentUserFullName: string
  currentUserImg?: string
  currentUserProfile?: string
}

export interface CommentDataProps {
  userId: string
  comId: string
  fullName: string
  createdTime: number
  avatarUrl?: string
  text: string
  userProfile?: string
  parentId?: string
  replies?: CommentDataProps[]
}

export interface CommentSectionProps {
  children?: any
  currentUser?: UserInfoProps
  logIn?: {
    loginLink: string
    signupLink: string
  }
  replyTop?: boolean
  customImg?: string
  inputStyle?: object
  formStyle?: object
  submitBtnStyle?: object
  cancelBtnStyle?: object
  overlayStyle?: object
  imgStyle?: object
  replyInputStyle?: object
  commentsCount?: number
  hrStyle?: object
  titleStyle?: object
  onSubmitAction?: (data: CommentDataProps, all: CommentDataProps[]) => void
  onDeleteAction?: (data: CommentDataProps, all: CommentDataProps[]) => void
  onReplyAction?: (data: CommentDataProps, all: CommentDataProps[]) => void
  onEditAction?: (data: CommentDataProps, all: CommentDataProps[]) => void
  customNoComment?: Function
  currentData?: Function
  removeEmoji?: boolean
  advancedInput?: boolean
  commentData: CommentDataProps[]
  allowDelete?: boolean
  allowEdit?: boolean
}

export interface GlobalProviderProps {
  currentUserData?: UserInfoProps
  replyTop?: boolean
  data: CommentDataProps[]
  handleAction: (id: string, edit: boolean) => void
  editArr: string[]
  onSubmit: (text: string, uuid: string) => [CommentDataProps | undefined, CommentDataProps[]]
  onEdit: (text: string, comId: string, parentId: string) => [CommentDataProps | undefined, CommentDataProps[]]
  replyArr: string[]
  onReply: (text: string, comId: string, parentId: string, uuid: string) => [CommentDataProps | undefined, CommentDataProps[]]
  onDelete: (comId: string, parentId?: string) => [CommentDataProps | undefined, CommentDataProps[]]
  customImg?: string
  inputStyle?: object
  formStyle?: object
  submitBtnStyle?: object
  cancelBtnStyle?: object
  imgStyle?: object
  commentsCount?: number
  onSubmitAction?: (data: CommentDataProps, all: CommentDataProps[]) => void
  onDeleteAction?: (data: CommentDataProps, all: CommentDataProps[]) => void
  onReplyAction?: (data: CommentDataProps, all: CommentDataProps[]) => void
  onEditAction?: (data: CommentDataProps, all: CommentDataProps[]) => void
  replyInputStyle?: object
  removeEmoji?: boolean
  advancedInput?: boolean
  allowDelete?: boolean
  allowEdit?: boolean
  utils: {
    flat: (arr: CommentDataProps[]) => CommentDataProps[]
    find: (data: CommentDataProps[], id: string) => CommentDataProps | undefined
    get_all_reply: (arr: CommentDataProps[]) => CommentDataProps[]
  }
}

const _flat = (arr: CommentDataProps[]): CommentDataProps[] => (
  arr.reduce((res, item) => (
    (res.push(item) && (item.replies && item.replies.length > 0 && res.push(..._flat(item.replies))) && 0) || res
  ), [] as CommentDataProps[])
)

const _get_all_reply = (arr: CommentDataProps[]): CommentDataProps[] => (
  arr.reduce((res, item) => (
    (item.replies && item.replies.length > 0 && res.push(..._flat(item.replies)) && 0) || res
  ), [] as CommentDataProps[])
)

const _find = (data: CommentDataProps[], id: string) => {
  return _flat(data).find((item) => item.comId === id)
}

export const GlobalContext = createContext<GlobalProviderProps>({
  data: [],
  handleAction: _.noop,
  editArr: [],
  onSubmit: _.noop as any,
  onEdit: _.noop as any,
  replyArr: [],
  onReply: _.noop as any,
  onDelete: _.noop as any,
  utils: {
    flat: _flat,
    find: _find,
    get_all_reply: _get_all_reply,
  }
})

const recursiveParentId = (data: CommentDataProps[], parentId?: string): CommentDataProps[] => {
  return data.map((item) => {
    if (item.replies && item.replies.length > 0) {
      return {
        ...item,
        replies: recursiveParentId(item.replies, item.comId),
        parentId: parentId || "",
      }
    }
    return {
      ...item,
      parentId: parentId || "",
    }
  })
}

export const GlobalProvider = ({
  children,
  currentUser,
  replyTop,
  customImg,
  inputStyle,
  formStyle,
  submitBtnStyle,
  cancelBtnStyle,
  imgStyle,
  commentsCount,
  commentData,
  onSubmitAction,
  onDeleteAction,
  onReplyAction,
  onEditAction,
  currentData,
  replyInputStyle,
  removeEmoji,
  advancedInput,
  allowDelete,
  allowEdit,
}: CommentSectionProps) => {
  const [currentUserData] = useState(currentUser)
  const initCommentData = useMemo(() => {
    return recursiveParentId(commentData)
  }, commentData)

  const [data, setData] = useState<CommentDataProps[]>(initCommentData)
  const [editArr, setEdit] = useState<string[]>([])
  const [replyArr, setReply] = useState<string[]>([])

  useEffect(() => {
    initCommentData && setData(recursiveParentId(commentData))
  }, [initCommentData])

  useEffect(() => {
    currentData && currentData(data)
  }, [data])

  const handleAction = (id?: string, edit?: boolean) => {
    if (edit) {
      const editArrCopy: string[] = [...editArr]
      const indexOfId = _.indexOf(editArrCopy, id)
      if (_.includes(editArr, id)) {
        editArrCopy.splice(indexOfId, 1)
        setEdit(editArrCopy)
      } else {
        editArrCopy.push(id || "")
        setEdit(editArrCopy)
      }
    } else {
      const replyArrCopy: string[] = [...replyArr]
      const indexOfId = _.indexOf(replyArrCopy, id)
      if (_.includes(replyArr, id)) {
        replyArrCopy.splice(indexOfId, 1)
        setReply(replyArrCopy)
      } else {
        replyArrCopy.push(id || "")
        setReply(replyArrCopy)
      }
    }
  }

  const onSubmit = (text: string, uuid: string): [CommentDataProps | undefined, CommentDataProps[]] => {
    const copyData = [...data]
    const newData = {
      userId: currentUserData!.currentUserId,
      comId: uuid,
      createdTime: +new Date(),
      avatarUrl: currentUserData!.currentUserImg,
      userProfile: currentUserData!.currentUserProfile
        ? currentUserData!.currentUserProfile
        : undefined,
      fullName: currentUserData!.currentUserFullName,
      text: text,
      parentId: undefined,
      replies: []
    }
    copyData.push(newData)
    setData(copyData)
    return [newData, copyData]
  }

  const onEdit = (text: string, comId: string, parentId: string): [CommentDataProps | undefined, CommentDataProps[]] => {
    const copyData = [...data]
    if (parentId) {
      const current = _find(copyData, comId)
      current && (current.text = text)
      setData(copyData)
      handleAction(comId, true)
      return [current, copyData]
    } else {
      const indexOfId = _.findIndex(copyData, { comId: comId })
      copyData[indexOfId].text = text
      setData(copyData)
      handleAction(comId, true)
      return [copyData[indexOfId], copyData]
    }
  }

  const onReply = (
    text: string,
    comId: string,
    parentId: string,
    uuid: string
  ): [CommentDataProps | undefined, CommentDataProps[]] => {
    const copyData = [...data]
    const parent = _find(copyData, comId)
    parent && !parent.replies && (parent.replies = [])
    parent!.replies!.push({
      userId: currentUserData!.currentUserId,
      comId: uuid,
      createdTime: +new Date(),
      avatarUrl: currentUserData!.currentUserImg,
      userProfile: currentUserData!.currentUserProfile
        ? currentUserData!.currentUserProfile
        : undefined,
      fullName: currentUserData!.currentUserFullName,
      text: text,
      parentId: comId,
      replies: []
    })

    setData(copyData)
    handleAction(comId, false)
    return [parent, copyData]
  }

  const onDelete = (comId: string, parentId: string): [CommentDataProps | undefined, CommentDataProps[]] => {
    const copyData = [...data]
    if (parentId) {
      const parent = _find(copyData, parentId)
      const child = _find(copyData, comId)
      _.remove(parent?.replies || [], (item) => item.comId === comId)
      setData(copyData)
      return [child, copyData]
    } else {
      const indexOfId = _.findIndex(copyData, { comId: comId })
      const deleted = copyData[indexOfId]
      copyData.splice(indexOfId, 1)
      setData(copyData)
      return [deleted, copyData]
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        currentUserData: currentUserData,
        replyTop: replyTop,
        data: data,
        handleAction: handleAction,
        editArr: editArr,
        onSubmit: onSubmit,
        onEdit: onEdit,
        replyArr: replyArr,
        onReply: onReply,
        onDelete: onDelete,
        customImg: customImg,
        inputStyle: inputStyle,
        formStyle: formStyle,
        submitBtnStyle: submitBtnStyle,
        cancelBtnStyle: cancelBtnStyle,
        imgStyle: imgStyle,
        commentsCount: commentsCount,
        onSubmitAction: onSubmitAction,
        onDeleteAction: onDeleteAction,
        onReplyAction: onReplyAction,
        onEditAction: onEditAction,
        replyInputStyle: replyInputStyle,
        removeEmoji: removeEmoji,
        advancedInput: advancedInput,
        allowDelete: allowDelete,
        allowEdit: allowEdit,
        utils: {
          flat: _flat,
          find: _find,
          get_all_reply: _get_all_reply,
        }
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
