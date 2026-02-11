import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface EnrollmentState {
    hasEnrolled: boolean;
    setEnrolled: (status: boolean) => void;
}

export const useEnrollmentStore = create<EnrollmentState>()(
    persist(
        (set) => ({
            hasEnrolled: false,
            setEnrolled: (status) => set({ hasEnrolled: status }),
        }),
        {
            name: 'enrollment-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
