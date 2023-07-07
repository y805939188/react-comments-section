import { v4 as uuidv4 } from 'uuid'
import CommentStructure from '../CommentStructure.tsx/Index'
import InputField from '../InputField/Index'
import './CommentSection.css'
import { useContext } from 'react'
import { GlobalContext, GlobalProviderProps, CommentDataProps } from '../../context/Provider'
import _ from 'lodash'
import React from 'react'
import LoginSection from '../LoginSection/LoginSection'
import NoComments from './NoComments'

interface CommentSectionProps {
  overlayStyle?: object
  logIn?: {
    loginLink: string
    signupLink: string
  }
  hrStyle?: object
  titleStyle?: object
  customNoComment?: Function
}

const CommentSection = ({
  overlayStyle,
  logIn,
  hrStyle,
  titleStyle,
  customNoComment
}: CommentSectionProps) => {
  const loginMode = () => {
    return (
      <LoginSection
        loginLink={logIn!.loginLink}
        signUpLink={logIn!.signupLink}
      />
    )
  }
  const globalStore: GlobalProviderProps = useContext(GlobalContext)

  const totalComments = () => {
    let count = 0
    globalStore.data.map((i: any) => {
      count = count + 1
      i.replies.map(() => (count = count + 1))
    })
    return count
  }

  const parents: { [key in string]: CommentDataProps } = {}
  const get_comments_map = (data: CommentDataProps[], parent?: CommentDataProps) => {
    data.forEach((item) => {
      if (parent) {
        parents[item.comId] = parent
      }
      get_comments_map(item.replies || [], item)
    })
  }
  get_comments_map(globalStore.data)
  return (
    <div className='overlay' style={overlayStyle}>
      <span className='comment-title' style={titleStyle}>
        {globalStore.commentsCount || totalComments()}{' '}
        {totalComments() === 1 ? 'Comment' : 'Comments'}
      </span>
      <hr className='hr-style' style={hrStyle} />
      {globalStore.data.length > 0 ? (
        globalStore.data.map(
          (i) => {
            return (
              <div key={i.comId}>
                <CommentStructure
                  info={i}
                  editMode={_.indexOf(globalStore.editArr, i.comId) !== -1}
                  replyMode={_.indexOf(globalStore.replyArr, i.comId) !== -1}
                  logIn={logIn}
                />
                {i.replies && i.replies.length > 0 &&
                    globalStore.utils.flat(i.replies).sort((a, b) => b.createdTime - a.createdTime).map((j) => {
                    return (
                      <div className='replySection' key={j.comId}>
                        <CommentStructure
                          info={j}
                          root={i}
                          parent={parents[j.comId]}
                          editMode={_.indexOf(globalStore.editArr, j.comId) !== -1}
                          replyMode={_.indexOf(globalStore.replyArr, j.comId) !== -1}
                          logIn={logIn}
                        />
                      </div>
                    )
                  })}
              </div>
            )
          }
        )
      ) : customNoComment ? (
        customNoComment()
      ) : (
        <NoComments />
      )}
      {logIn && globalStore.currentUserData === null ? (
        loginMode()
      ) : (
        <InputField formStyle={{ margin: '10px 0px' }} comId={uuidv4()} imgDiv={{ margin: 0 }} />
      )}
    </div>
  )
}

export default CommentSection
