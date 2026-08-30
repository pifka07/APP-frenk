import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, Mail, CheckCircle2 } from "lucide-react";
import { supabase } from '@/api/base44Client';

export default function LoginModal({ open, onClose }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email.trim()) return;
        setLoading(true);
        setError('');
        const { error: err } = await supabase.auth.signInWithOtp({
            email: email.trim().toLowerCase(),
            options: { emailRedirectTo: window.location.origin },
        });
        setLoading(false);
        if (err) {
            setError(err.message);
        } else {
            setSent(true);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-sm">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${sent ? 'bg-teal-500/20' : 'bg-purple-500/20'}`}>
                            {sent
                                ? <CheckCircle2 className="w-8 h-8 text-teal-400" />
                                : <Lock className="w-8 h-8 text-purple-400" />
                            }
                        </div>
                    </div>
                    <DialogTitle className="text-2xl text-center text-white">
                        {sent ? 'E-Mail gesendet!' : 'Login erforderlich'}
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-300 text-base pt-2">
                        {sent
                            ? `Bitte öffne den Link in der E-Mail an ${email}.`
                            : 'Bitte einloggen, damit wir deine Punkte, Münzen und Highscores speichern können.'
                        }
                    </DialogDescription>
                </DialogHeader>

                {!sent && (
                    <div className="space-y-3 mt-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="email"
                                placeholder="deine@email.de"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <Button
                            onClick={handleLogin}
                            disabled={loading || !email.trim()}
                            className="w-full h-12 bg-teal-500 hover:bg-teal-400 text-white font-bold text-lg border-4 border-slate-900 shadow-[0_4px_0_#0f172a] active:shadow-none active:translate-y-1 rounded-full"
                        >
                            {loading ? 'Sende...' : 'Magic Link senden'}
                        </Button>
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="w-full h-12 bg-slate-700 hover:bg-slate-600 text-white font-bold border-4 border-slate-900 shadow-[0_4px_0_#0f172a] active:shadow-none active:translate-y-1 rounded-full"
                        >
                            Abbrechen
                        </Button>
                        <p className="text-xs text-slate-400 text-center">
                            Du bekommst einen Login-Link per E-Mail — kein Passwort nötig.
                        </p>
                    </div>
                )}

                {sent && (
                    <Button
                        onClick={onClose}
                        className="mt-4 w-full h-12 bg-teal-500 hover:bg-teal-400 text-white font-bold border-4 border-slate-900 shadow-[0_4px_0_#0f172a] active:shadow-none active:translate-y-1 rounded-full"
                    >
                        OK, ich schaue nach!
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    );
}