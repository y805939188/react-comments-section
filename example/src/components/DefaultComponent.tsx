import React from 'react'
import { CommentSection } from 'react-comments-section'
import 'react-comments-section/dist/index.css'

const DefaultComponent = () => {
  // const data = [
  //   {
  //     userId: 'ding1',
  //     comId: '111',
  //     fullName: 'Riya Negi',
  //     createdTime: 1688646541266,
  //     // avatarUrl: 'https://ui-avatars.com/api/name=Riya&background=random',
  //     // userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
  //     text: 'Hey, Loved your blog! ',

  //     replies: [
  //       {
  //         userId: 'ding2',
  //         comId: '222',
  //         // userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
  //         fullName: 'Adam Scott',
  //         createdTime: 1688646616654,
  //         // avatarUrl: 'https://ui-avatars.com/api/name=Adam&background=random',
  //         text: 'Thanks! It took me 1 month to finish this project but I am glad it helped out someone!🥰'
  //       },
  //       {
  //         userId: 'ding3',
  //         comId: '333',
  //         createdTime: 1688646629594,
  //         // userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
  //         fullName: 'Riya Negi',
  //         // avatarUrl: 'https://ui-avatars.com/api/name=Riya&background=random',
  //         text: 'thanks!😊'
  //       }
  //     ]
  //   },
  //   {
  //     userId: 'ding4',
  //     comId: '444',
  //     fullName: 'Lily',
  //     createdTime: 1688646647727,
  //     // userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
  //     text: 'I have a doubt about the 4th point🤔',
  //     // avatarUrl: 'https://ui-avatars.com/api/name=Lily&background=random',
  //     replies: []
  //   }
  // ]
  return (
    <div style={{ width: '100%' }}>
      <CommentSection
        currentUser={{
          currentUserId: 'ding1',
          currentUserFullName: 'ding1'
        }}
        titleStyle={{display: 'none'}}
        hrStyle={{ display: 'none' }}
        commentData={[]}
        customNoComment={"test"}
        onSubmitAction={(data, all) => console.log('check submit, ', data, all)}
        onReplyAction={(data, all) => console.log('check reply, ', data, all)}
        currentData={(data: any) => {
          console.log('curent data', data)
        }}
      />
    </div>
  )
}

export default DefaultComponent
