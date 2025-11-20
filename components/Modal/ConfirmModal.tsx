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
  routeLogin: string;
  routeReg: string;
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
  routeLogin = "/auth/login",
  routeReg = "/auth/register",
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
            <Link
              href={routeReg}
              className={`${styles.button} ${styles.cancelButton}`}
            >
              {cancelText}
            </Link>
          )}

          {confirmText === "Відмінити" ? (
            <button
              onClick={onConfirm}
              className={`${styles.button} ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          ) : (
            <Link
              href={routeLogin}
              className={`${styles.button} ${styles.confirmButton}`}
            >
              {confirmText}
            </Link>
          )}
        </div>
      </div>
    </Modal>
  );
};
