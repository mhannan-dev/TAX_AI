import AuthField from '@/Components/Auth/AuthField';
import AuthShell from '@/Components/Auth/AuthShell';
import AuthSubmitButton from '@/Components/Auth/AuthSubmitButton';
import { Input } from '@/Components/ui/input';
import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthShell
            title="Choose a new password"
            subtitle="Use a long, unique password for your account."
        >
            <Head title="Reset Password" />

            <form onSubmit={submit} className="space-y-4">
                <AuthField id="email" label="Work email" error={errors.email}>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        autoComplete="username"
                    />
                </AuthField>

                <AuthField
                    id="password"
                    label="New password"
                    error={errors.password}
                >
                    <Input
                        id="password"
                        type="password"
                        autoFocus
                        autoComplete="new-password"
                        value={data.password}
                        onChange={(event) =>
                            setData('password', event.target.value)
                        }
                    />
                </AuthField>

                <AuthField
                    id="password_confirmation"
                    label="Confirm new password"
                    error={errors.password_confirmation}
                >
                    <Input
                        id="password_confirmation"
                        type="password"
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(event) =>
                            setData('password_confirmation', event.target.value)
                        }
                    />
                </AuthField>

                <AuthSubmitButton processing={processing}>
                    Reset password
                </AuthSubmitButton>
            </form>
        </AuthShell>
    );
}
