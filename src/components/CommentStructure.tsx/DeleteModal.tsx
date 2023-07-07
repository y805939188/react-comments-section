import { useState, useContext } from 'react'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'
import { GlobalContext, GlobalProviderProps } from '../../context/Provider'
import React from 'react'

interface DeleteModalProps {
  comId: string
  parentId?: string
}

const DeleteModal = ({ comId, parentId }: DeleteModalProps) => {
  const [open, setOpen] = useState(false)
  const onOpenModal = () => setOpen(true)
  const onCloseModal = () => setOpen(false)
  const globalStore: GlobalProviderProps = useContext(GlobalContext)

  return (
    <div>
      <div style={{ width: '100%' }} onClick={onOpenModal}>
        delete
      </div>
      <Modal open={open} onClose={onCloseModal} center>
        <h2>Are you sure?</h2>
        <p>Once you delete this comment it will be gone forever.</p>
        <div className='deleteBtns'>
          <button
            className='delete'
            onClick={async () => {
              const [data, all] = await globalStore.onDelete(comId, parentId)
              data && globalStore.onDeleteAction && (await globalStore.onDeleteAction(data, all))
            }}
          >
            Delete
          </button>
          <button className='cancel' onClick={onCloseModal}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default DeleteModal
