
'use client';

import { Modal } from './Modal'; 
import styles from './ConfirmModal.module.css';


interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void; 
  onClose: () => void;  
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  onClose, 
  confirmText = "Підтвердити", 
  cancelText = "Скасувати",
}) => {
  if (!isOpen) {
    return null;
  }

 
  return (
    <Modal onClose={onClose}> 
      <div className={styles.confirmWrapper}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          
          <button onClick={onCancel} className={styles.cancelButton}>
            {cancelText}
          </button>
         
          <button onClick={onConfirm} className={styles.confirmButton}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};