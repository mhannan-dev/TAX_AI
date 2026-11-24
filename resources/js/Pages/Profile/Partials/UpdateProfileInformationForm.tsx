import { Link, useForm, usePage } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <Card className={className}>
            <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-base">Profile information</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                    Update your name and email address.
                </p>
            </CardHeader>
            <CardContent className="pt-5">
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            autoComplete="name"
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                            required
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="username"
                            value={data.email}
                            onChange={(event) =>
                                setData('email', event.target.value)
                            }
                            required
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                            Your email is unverified.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-medium underline underline-offset-2"
                            >
                                Resend verification email
                            </Link>
                            {status === 'verification-link-sent' && (
                                <p className="mt-1">
                                    A new verification link has been sent.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            Save changes
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
