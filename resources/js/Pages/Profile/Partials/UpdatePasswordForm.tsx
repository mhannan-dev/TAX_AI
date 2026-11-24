import { useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { useRef } from 'react';

import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (event) => {
        event.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <Card className={className}>
            <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-base">Update password</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                    Use a long, unique password to protect your account.
                </p>
            </CardHeader>
            <CardContent className="pt-5">
                <form onSubmit={updatePassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current_password">
                            Current password
                        </Label>
                        <Input
                            id="current_password"
                            ref={currentPasswordInput}
                            type="password"
                            autoComplete="current-password"
                            value={data.current_password}
                            onChange={(event) =>
                                setData('current_password', event.target.value)
                            }
                        />
                        {errors.current_password && (
                            <p className="text-xs text-destructive">
                                {errors.current_password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">New password</Label>
                        <Input
                            id="password"
                            ref={passwordInput}
                            type="password"
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(event) =>
                                setData('password', event.target.value)
                            }
                        />
                        {errors.password && (
                            <p className="text-xs text-destructive">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">
                            Confirm password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(event) =>
                                setData(
                                    'password_confirmation',
                                    event.target.value,
                                )
                            }
                        />
                        {errors.password_confirmation && (
                            <p className="text-xs text-destructive">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            Update password
                        </Button>
                        {recentlySuccessful && (
                            <Badge variant="success">Saved</Badge>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
