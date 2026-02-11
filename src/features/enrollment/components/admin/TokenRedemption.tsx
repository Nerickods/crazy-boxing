'use client';

import { useState } from 'react';
import { redemptionService } from '@/features/enrollment/services/redemptionService';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export function TokenRedemption() {
    const [token, setToken] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'error' | 'redeemed'>('idle');
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');

    const handleValidate = async () => {
        if (!token || token.length < 6) {
            setError('El token debe tener al menos 6 caracteres');
            return;
        }

        setStatus('loading');
        setError('');

        try {
            const res = await redemptionService.validateToken(token.toUpperCase());
            if (res.success) {
                if (!res.data) {
                    setStatus('error');
                    setError('Token no encontrado');
                } else {
                    setData(res.data);
                    setStatus('valid');
                }
            } else {
                setStatus('error');
                setError(res.error || 'Error al validar token');
            }
        } catch (err) {
            setStatus('error');
            setError('Error inesperado');
        }
    };

    const handleRedeem = async () => {
        setStatus('loading');
        try {
            const res = await redemptionService.redeemToken(token.toUpperCase());
            if (res.success) {
                setStatus('redeemed');
                // Update local data to reflect change
                setData({ ...data, token_status: 'redeemed', token_redeemed_at: new Date().toISOString() });
            } else {
                setStatus('error');
                setError(res.error || 'Error al canjear token');
            }
        } catch (err) {
            setStatus('error');
            setError('Error al conectar con el servidor');
        }
    };

    const reset = () => {
        setToken('');
        setStatus('idle');
        setData(null);
        setError('');
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <Card>
                <CardHeader>
                    <CardTitle>Canje de Tokens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Ingrese Token (ej: A1B2C3)"
                            value={token}
                            onChange={(e) => setToken(e.target.value.toUpperCase())}
                            disabled={status === 'loading' || status === 'redeemed'}
                        />
                        <Button onClick={handleValidate} disabled={status === 'loading' || status === 'redeemed' || !token}>
                            {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Buscar'}
                        </Button>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {data && (
                        <div className="p-4 border rounded-lg bg-secondary/10 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Estado:</span>
                                <Badge variant={data.token_status === 'redeemed' ? 'destructive' : 'default'}>
                                    {data.token_status === 'redeemed' ? 'Ya Canjeado' : 'Válido'}
                                </Badge>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nombre:</p>
                                <p className="text-lg font-bold">{data.name}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Email:</p>
                                <p className="text-base">{data.email}</p>
                            </div>

                            {data.preferred_schedule && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Fecha pref:</p>
                                    <p className="text-base">{data.preferred_schedule}</p>
                                </div>
                            )}

                            {data.token_status === 'redeemed' && data.token_redeemed_at && (
                                <div className="text-xs text-muted-foreground mt-2">
                                    Canjeado el: {new Date(data.token_redeemed_at).toLocaleString()}
                                </div>
                            )}
                        </div>
                    )}

                    {status === 'redeemed' && (
                        <Alert className="bg-green-500/15 border-green-500/50 text-green-700 dark:text-green-300">
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>¡Éxito!</AlertTitle>
                            <AlertDescription>El token ha sido canjeado correctamente y la asistencia registrada.</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    {status === 'redeemed' ? (
                        <Button onClick={reset} variant="outline" className="w-full">
                            Procesar Otro
                        </Button>
                    ) : (
                        status === 'valid' && data?.token_status !== 'redeemed' && (
                            <Button onClick={handleRedeem} className="w-full bg-green-600 hover:bg-green-700 text-white">
                                Confirmar y Canjear
                            </Button>
                        )
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
