import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { enrollmentService } from '@/features/enrollment/services/enrollmentServerService';

const MarkContactedSchema = z.object({
    contacted_by: z.string().min(1, 'El nombre es requerido'),
});

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Validate input
        const validationResult = MarkContactedSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const { contacted_by } = validationResult.data;

        // Update enrollment
        const updatedEnrollment = await enrollmentService.markAsContacted(id, contacted_by);

        return NextResponse.json(updatedEnrollment);
    } catch (error) {
        console.error('Error marking enrollment as contacted:', error);
        return NextResponse.json(
            { error: 'Error al marcar como contactado' },
            { status: 500 }
        );
    }
}
