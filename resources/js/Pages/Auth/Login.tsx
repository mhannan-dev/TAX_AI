import AuthAlert from '@/Components/Auth/AuthAlert';
import AuthField from '@/Components/Auth/AuthField';
import AuthShell from '@/Components/Auth/AuthShell';
import AuthSubmitButton from '@/Components/Auth/AuthSubmitButton';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Input } from '@/Components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import { Zap } from 'lucide-react';
import type { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
    demoCredentials,
}: {
    status?: string;
    canResetPassword: boolean;
    demoCredentials: { email: string; password: string } | null;
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <AuthShell
            title="Welcome back"
            subtitle="Sign in to review invoices and approvals."
            footer={
                <p>
                    New to Tax Autopilot?{' '}
                    <Link
                        href={route('register')}
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            }
        >
            <Head title="Log in" />

            <div className="space-y-5">
                <AuthAlert message={status} />

                <form onSubmit={submit} className="space-y-4">
                    <AuthField id="email" label="Work email" error={errors.email}>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="username"
                            autoFocus
                            value={data.email}
                            onChange={(event) =>
                                setData('email', event.target.value)
                            }
                            placeholder="you@company.com"
                        />
                    </AuthField>

                    <AuthField
                        id="password"
                        label="Password"
                        error={errors.password}
                    >
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(event) =>
                                setData('password', event.target.value)
                            }
                            placeholder="••••••••"
                        />
                    </AuthField>

                    <div className="flex items-center justify-between gap-4">
                        <label
                            htmlFor="remember"
                            className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"
                        >
                            <Checkbox
                                id="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) =>
                                    setData('remember', checked === true)
                                }
                            />
                            Remember me
                        </label>

                        {canResetPassword && (
                            <Button asChild variant="link" className="h-auto p-0">
                                <Link href={route('password.request')}>
                                    Forgot password?
                                </Link>
                            </Button>
                        )}
                    </div>

                    <AuthSubmitButton processing={processing}>
                        Log in
                    </AuthSubmitButton>
                </form>

                {demoCredentials && (
                    <div className="space-y-3 border-t pt-5">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Try the demo workspace</p>
                            <p className="text-xs text-muted-foreground">
                                Fill the demo credentials, then click Log in. Available locally only.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={processing}
                            onClick={() => {
                                setData((current) => ({ ...current, ...demoCredentials }));
                                clearErrors('email', 'password');
                            }}
                        >
                            <Zap className="h-4 w-4" aria-hidden="true" />
                            Quick demo login
                        </Button>
                    </div>
                )}
            </div>
        </AuthShell>
    );
}
