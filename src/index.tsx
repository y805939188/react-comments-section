import * as React from 'react'
import CommentSectionComponent from './components/CommentSectionComponent/Index'
import GlobalProvider, { UserInfoProps, CommentDataProps, CommentSectionProps } from './context/Provider'
import './Index.scss'

export {
  UserInfoProps,
  CommentDataProps,
  CommentSectionProps,
};

export const CommentSection = ({
  currentUser,
  customImg,
  inputStyle,
  formStyle,
  submitBtnStyle,
  cancelBtnStyle,
  overlayStyle,
  replyInputStyle,
  logIn,
  imgStyle,
  replyTop,
  commentsCount,
  commentData,
  hrStyle,
  titleStyle,
  removeEmoji,
  onSubmitAction,
  onDeleteAction,
  onReplyAction,
  onEditAction,
  customNoComment,
  currentData,
  advancedInput,
  allowDelete = true,
  allowEdit = true,
}: CommentSectionProps) => {
  return (
    <GlobalProvider
      currentUser={currentUser}
      replyTop={replyTop}
      customImg={customImg}
      inputStyle={inputStyle}
      formStyle={formStyle}
      submitBtnStyle={submitBtnStyle}
      cancelBtnStyle={cancelBtnStyle}
      replyInputStyle={replyInputStyle}
      imgStyle={imgStyle}
      commentsCount={commentsCount}
      commentData={commentData}
      onSubmitAction={onSubmitAction}
      onDeleteAction={onDeleteAction}
      onReplyAction={onReplyAction}
      onEditAction={onEditAction}
      currentData={currentData}
      removeEmoji={removeEmoji}
      advancedInput={advancedInput}
      allowDelete={allowDelete}
      allowEdit={allowEdit}
    >
      <CommentSectionComponent
        overlayStyle={overlayStyle}
        hrStyle={hrStyle}
        logIn={logIn}
        titleStyle={titleStyle}
        customNoComment={customNoComment}
      />
    </GlobalProvider>
  )
}
