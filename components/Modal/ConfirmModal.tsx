"use client";

import { Modal } from "./Modal";
import styles from "./ConfirmModal.module.css";
import Link from "next/link";
import Icon from "@/components/Icon/Icon";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  routeLogin?: string;
  routeReg?: string;
  isNavigation?: boolean;
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
  isNavigation = false,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal onClose={onClose}>
      <div className={styles.confirmWrapper}>
        <button 
          onClick={onClose} 
          className={styles.closeButton} 
          aria-label="Закрити"
        >
          <Icon name="icon-close" size={24} />
        </button>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        
        <div className={styles.buttons}>
          {!isNavigation ? (
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

          {!isNavigation ? (
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