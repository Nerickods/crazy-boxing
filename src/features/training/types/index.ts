export interface ClassSchedule {
    id: string;
    discipline: string;
    type: string;
    day: string;
    time: string;
    duration: string;
    instructor: string;
    level: string;
    spots: number;
    created_at?: string;
}
