'use client';

import { useState } from 'react';
import { redemptionService } from '@/features/enrollment/services/redemptionService';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Phone, Key } from 'lucide-react';

type SearchMode = 'token' | 'phone';

export function TokenRedemption() {
    const [searchValue, setSearchValue] = useState('');
    const [searchMode, setSearchMode] = useState<SearchMode>('token');
    const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'error' | 'redeemed'>('idle');
    const [data, setData] = useState<any>(null);
    const [resolvedToken, setResolvedToken] = useState('');
    const [error, setError] = useState('');

    const handleValidate = async () => {
        const trimmed = searchValue.trim();
        if (!trimmed) {
            setError(searchMode === 'token' ? 'Ingrese un token' : 'Ingrese un número de teléfono');
            return;
        }

        if (searchMode === 'token' && trimmed.length < 6) {
            setError('El token debe tener al menos 6 caracteres');
            return;
        }

        if (searchMode === 'phone' && trimmed.replace(/\D/g, '').length < 10) {
            setError('El teléfono debe tener 10 dígitos');
            return;
        }

        setStatus('loading');
        setError('');

        try {
            let res;
            if (searchMode === 'token') {
                res = await redemptionService.validateToken(trimmed.toUpperCase());
                if (res.success) setResolvedToken(trimmed.toUpperCase());
            } else {
                res = await redemptionService.validateByPhone(trimmed.replace(/\D/g, ''));
                if (res.success && res.data?.redemption_token) {
                    setResolvedToken(res.data.redemption_token);
                }
            }

            if (res.success) {
                if (!res.data) {
                    setStatus('error');
                    setError(searchMode === 'token' ? 'Token no encontrado' : 'Teléfono no encontrado');
                } else {
                    setData(res.data);
                    setStatus('valid');
                }
            } else {
                setStatus('error');
                setError(res.error || 'Error al validar');
            }
        } catch (err) {
            setStatus('error');
            setError('Error inesperado');
        }
    };

    const handleRedeem = async () => {
        if (!resolvedToken) {
            setError('No se pudo resolver el token');
            return;
        }
        setStatus('loading');
        try {
            const res = await redemptionService.redeemToken(resolvedToken);
            if (res.success) {
                setStatus('redeemed');
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
        setSearchValue('');
        setSearchMode('token');
        setStatus('idle');
        setData(null);
        setResolvedToken('');
        setError('');
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <Card>
                <CardHeader>
                    <CardTitle>Canje de Tokens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Search Mode Toggle */}
                    <div className="flex gap-2">
                        <Button
                            variant={searchMode === 'token' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => { setSearchMode('token'); setSearchValue(''); setError(''); }}
                            disabled={status === 'loading' || status === 'redeemed'}
                        >
                            <Key className="w-4 h-4 mr-1" /> Token
                        </Button>
                        <Button
                            variant={searchMode === 'phone' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => { setSearchMode('phone'); setSearchValue(''); setError(''); }}
                            disabled={status === 'loading' || status === 'redeemed'}
                        >
                            <Phone className="w-4 h-4 mr-1" /> Teléfono
                        </Button>
                    </div>

                    {/* Search Input */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder={searchMode === 'token' ? 'Ingrese Token (ej: A1B2C3)' : 'Teléfono (ej: 3312345678)'}
                            value={searchValue}
                            onChange={(e) => {
                                if (searchMode === 'phone') {
                                    setSearchValue(e.target.value.replace(/\D/g, '').slice(0, 10));
                                } else {
                                    setSearchValue(e.target.value.toUpperCase());
                                }
                            }}
                            disabled={status === 'loading' || status === 'redeemed'}
                            inputMode={searchMode === 'phone' ? 'numeric' : 'text'}
                        />
                        <Button onClick={handleValidate} disabled={status === 'loading' || status === 'redeemed' || !searchValue}>
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
                                <p className="text-sm font-medium text-muted-foreground">Teléfono:</p>
                                <p className="text-base font-mono">{data.phone || 'N/A'}</p>
                            </div>

                            {data.email && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email:</p>
                                    <p className="text-base text-muted-foreground">{data.email}</p>
                                </div>
                            )}

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
