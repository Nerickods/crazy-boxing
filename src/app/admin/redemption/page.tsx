import { TokenRedemption } from '@/features/enrollment/components/admin/TokenRedemption';

export default function RedemptionPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Validación de Citas</h1>
            <TokenRedemption />
        </div>
    );
}
