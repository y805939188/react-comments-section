import './InputField.scss'
import { useContext, useEffect, useState } from 'react'
import { GlobalContext, GlobalProviderProps, CommentDataProps } from '../../context/Provider'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import RegularInput from './RegularInput'
import AdvancedInput from './AdvancedInput'

interface InputFieldProps {
  formStyle?: object
  comId: string
  fillerText?: string
  parentId?: string
  mode?: string
  customImg?: string
  inputStyle?: object
  cancelBtnStyle?: object
  submitBtnStyle?: object
  imgStyle?: object
  imgDiv?: object
}

const InputField = ({
  formStyle,
  comId,
  fillerText,
  parentId,
  mode,
  customImg,
  inputStyle,
  cancelBtnStyle,
  submitBtnStyle,
  imgStyle,
  imgDiv
}: InputFieldProps) => {
  const [text, setText] = useState('')

  useEffect(() => {
    if (fillerText) {
      setText(fillerText)
    }
  }, [fillerText])

  const globalStore: GlobalProviderProps = useContext(GlobalContext)

  const editMode = async (advText?: string) => {
    const textToSend = advText ? advText : text
    const [data, all] = await globalStore.onEdit(textToSend, comId, parentId || "")
    data && globalStore.onEditAction && (await globalStore.onEditAction(data, all))
  }

  const replyMode = async (replyUuid: string, advText?: string) => {
    const textToSend = advText ? advText : text
    const [data, all] = await globalStore.onReply(textToSend, comId, parentId || "", replyUuid)
    data && globalStore.onReplyAction && (await globalStore.onReplyAction(data, all))
  }

  const submitMode = async (createUuid: string, advText?: string) => {
    const textToSend = advText ? advText : text
    const [data, all] = await globalStore.onSubmit(textToSend, createUuid)
    data && globalStore.onSubmitAction && (await globalStore.onSubmitAction(data, all))
  }

  const handleSubmit = async (event: any, advText?: string) => {
    event.preventDefault()
    const createUuid = uuidv4()
    const replyUuid = uuidv4()
    mode === 'editMode'
      ? editMode(advText)
      : mode === 'replyMode'
      ? replyMode(replyUuid, advText)
      : submitMode(createUuid, advText)
    setText('')
  }

  return (
    <div>
      {globalStore.advancedInput ? (
        <AdvancedInput
          handleSubmit={handleSubmit}
          text={mode === 'editMode' ? text : ''}
          formStyle={formStyle}
          mode={mode}
          cancelBtnStyle={cancelBtnStyle}
          submitBtnStyle={submitBtnStyle}
          comId={comId}
          imgDiv={imgDiv}
          imgStyle={imgStyle}
          customImg={customImg}
        />
      ) : (
        <RegularInput
          formStyle={formStyle}
          imgDiv={imgDiv}
          imgStyle={imgStyle}
          customImg={customImg}
          mode={mode}
          inputStyle={inputStyle}
          cancelBtnStyle={cancelBtnStyle}
          comId={comId}
          submitBtnStyle={submitBtnStyle}
          handleSubmit={handleSubmit}
          text={text}
          setText={setText}
        />
      )}
    </div>
  )
}
export default InputField
