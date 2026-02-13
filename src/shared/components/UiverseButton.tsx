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
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const { hasEnrolled } = useEnrollmentStore();

    // Global override if user already enrolled - ONLY for submit buttons
    const activeSuccess = isSuccess || (hasEnrolled && type === 'submit');
    const isDisabled = hasEnrolled && type === 'submit';

    const handleWrapperClick = (e: React.MouseEvent) => {
        if (isDisabled) return;

        if (onClick) {
            onClick();
        } else if (type === 'submit' && buttonRef.current) {
            // Fix Dead Zone: If clicking wrapper (padding), trigger submit button
            // But verify event didn't bubble from the button itself to avoid invalid double-click issues (though click() on button usually is safe)
            if (!buttonRef.current.contains(e.target as Node)) {
                buttonRef.current.click();
            }
        }
    };

    return (
        <div
            className={`${styles.btnWrapper} ${className || ''} ${activeSuccess ? styles.success : ''} ${isDisabled ? styles.disabled : ''}`}
            onClick={handleWrapperClick}
            style={style}
        >
            <button ref={buttonRef} className={styles.btn} type={type} disabled={isDisabled}>
                <span className={styles.btnTxt}>{text}</span>
            </button>
            <div className={`${styles.dot} ${styles.pulse}`}></div>
        </div>
    );
};

export default UiverseButton;
