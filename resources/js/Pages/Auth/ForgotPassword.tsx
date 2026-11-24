import AuthAlert from '@/Components/Auth/AuthAlert';
import AuthField from '@/Components/Auth/AuthField';
import AuthShell from '@/Components/Auth/AuthShell';
import AuthSubmitButton from '@/Components/Auth/AuthSubmitButton';
import { Input } from '@/Components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthShell
            title="Reset your password"
            subtitle="We will email you a secure reset link."
            footer={
                <Link
                    href={route('login')}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                    Back to log in
                </Link>
            }
        >
            <Head title="Forgot Password" />

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

                    <AuthSubmitButton processing={processing}>
                        Email reset link
                    </AuthSubmitButton>
                </form>
            </div>
        </AuthShell>
    );
}
