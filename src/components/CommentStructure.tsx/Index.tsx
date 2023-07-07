import './CommentStructure.scss'
import { useContext } from 'react'
import { GlobalContext, GlobalProviderProps, CommentDataProps } from '../../context/Provider'
import InputField from '../InputField/Index'
import { Menu, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/core.css'
import DeleteModal from './DeleteModal'
import React from 'react'

interface CommentStructureProps {
  info: CommentDataProps
  editMode: boolean
  root?: CommentDataProps
  parent?: CommentDataProps
  replyMode: boolean
  logIn?: {
    loginLink: string
    signupLink: string
  }
}

const CommentStructure = ({
  info,
  editMode,
  root,
  parent,
  replyMode
}: CommentStructureProps) => {
  const globalStore: GlobalProviderProps = useContext(GlobalContext)
  const currentUser = globalStore.currentUserData

  const optionsMenu = () => {
    return (globalStore.allowDelete || globalStore.allowEdit) && (
      <div className='userActions'>
        {info.userId === currentUser?.currentUserId && (
          <Menu
            menuButton={
              <button className='actionsBtn'>
                {' '}
                <div className='optionIcon' />
              </button>
            }
          >
            {globalStore.allowEdit && <MenuItem
              onClick={() => globalStore.handleAction(info.comId, true)}
            >
              edit
            </MenuItem>}
            {globalStore.allowDelete && <MenuItem>
              <DeleteModal comId={info.comId} parentId={info.parentId} />
            </MenuItem>}
          </Menu>
        )}
      </div>
    )
  }

  const userInfo = () => {
    return (
      <div className='commentsTwo'>
        {info.userProfile ? (
          <a className='userLink' target='_blank' href={info.userProfile}>
            {info.avatarUrl && <div>
              <img
                src={info.avatarUrl}
                alt='userIcon'
                className='imgdefault'
                style={
                  globalStore.imgStyle ||
                  (!globalStore.replyTop ? { position: 'relative', top: 7 } : undefined)
                }
              />
            </div>}
            <div className='fullName'>
              {info.fullName} - <i>{new Date(info.createdTime).toLocaleString()}</i> {root?.comId !== parent?.comId && <span>{parent && `  reply @${parent.fullName}`}</span>}
            </div>
          </a>
        ) : (
          <div>
            {info.avatarUrl && <div>
              <img
                src={info.avatarUrl}
                alt='userIcon'
                className='imgdefault'
                style={
                  globalStore.imgStyle ||
                  (!globalStore.replyTop ? { position: 'relative', top: 7 } : undefined)
                }
              />
            </div>}
            <div className='fullName'>
              {info.fullName} - <i>{new Date(info.createdTime).toLocaleString()}</i> {root?.comId !== parent?.comId && <span>{parent && `  reply @${parent.fullName}`}</span>}
            </div>
          </div>
        )}
      </div>
    )
  }

  const replyTopSection = () => {
    return (
      <div className='halfDiv'>
        <div className='userInfo'>
          <div>{info.text}</div>
          {userInfo()}
        </div>
        {currentUser && optionsMenu()}
      </div>
    )
  }

  const replyBottomSection = () => {
    return (
      <div className='halfDiv'>
        <div className='userInfo'>
          {userInfo()}
          {globalStore.advancedInput ? (
            <div
              className='infoStyle'
              dangerouslySetInnerHTML={{
                __html: info.text
              }}
            />
          ) : (
            <div className='infoStyle'>{info.text}</div>
          )}
          <div style={{ marginLeft: 32 }}>
            {' '}
            {currentUser && (
              <div>
                <button
                  className='replyBtn'
                  onClick={() => globalStore.handleAction(info.comId, false)}
                >
                  <div className='replyIcon' />
                  <span style={{ marginLeft: 17 }}>Reply</span>
                </button>
              </div>
            )}
          </div>
        </div>
        {currentUser && optionsMenu()}
      </div>
    )
  }

  const actionModeSection = (mode: string) => {
    if (mode === 'reply') {
      return (
        <div className='replysection'>
          {globalStore.replyTop ? replyTopSection() : replyBottomSection()}
          <InputField
            formStyle={{
              backgroundColor: 'transparent',
              padding: '20px 0px',
              marginLeft: '-15px'
            }}
            comId={info.comId}
            fillerText={''}
            mode={'replyMode'}
            // parentId={info.comId}
            parentId={info.parentId}
          />
        </div>
      )
    } else {
      return (
        <InputField
          formStyle={{
            backgroundColor: 'transparent',
            padding: '20px 0px',
            marginLeft: '-15px'
          }}
          comId={info.comId}
          fillerText={info.text}
          mode={'editMode'}
          // parentId={parentId}
          parentId={info.parentId}
        />
      )
    }
  }

  return (
    <div>
      {editMode
        ? actionModeSection('edit')
        : replyMode
        ? actionModeSection('reply')
        : globalStore.replyTop
        ? replyTopSection()
        : replyBottomSection()}
    </div>
  )
}

export default CommentStructure
