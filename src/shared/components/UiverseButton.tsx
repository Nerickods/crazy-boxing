import React from 'react';
import styles from './UiverseButton.module.css';
import { useEnrollmentStore } from '@/features/enrollment/store/useEnrollmentStore';

interface UiverseButtonProps {
    text: string;
    onClick?: () => void;
    className?: string; // Optional custom class
    style?: React.CSSProperties; // Optional custom styles (for variables)
    type?: "button" | "submit" | "reset";
    isSuccess?: boolean;
}

const UiverseButton: React.FC<UiverseButtonProps> = ({ text, onClick, className, style, type = "button", isSuccess }) => {
    const { hasEnrolled } = useEnrollmentStore();

    // Global override if user already enrolled
    const activeSuccess = isSuccess || hasEnrolled;
    const isDisabled = hasEnrolled;

    return (
        <div
            className={`${styles.btnWrapper} ${className || ''} ${activeSuccess ? styles.success : ''} ${isDisabled ? styles.disabled : ''}`}
            onClick={isDisabled ? undefined : onClick}
            style={style}
        >
            <button className={styles.btn} type={type} disabled={isDisabled}>
                <span className={styles.btnTxt}>{text}</span>
            </button>
            <div className={`${styles.dot} ${styles.pulse}`}></div>
        </div>
    );
};

export default UiverseButton;
