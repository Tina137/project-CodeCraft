"use client";

import { Modal } from "./Modal";
import styles from "./ConfirmModal.module.css";
import Link from "next/link";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  route: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  onClose,
  confirmText = "Відмінити",
  cancelText = "Вийти",
  route,
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
          {confirmText === "Відмінити" ? (
            <button
              onClick={onCancel}
              className={`${styles.button} ${styles.cancelButton}`}
            >
              {cancelText}
            </button>
          ) : (
            <Link href={route}>kk</Link>
          )}

          <button
            onClick={onConfirm}
            className={`${styles.button} ${styles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
