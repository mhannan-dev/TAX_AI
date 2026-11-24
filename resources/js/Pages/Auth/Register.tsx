import AuthField from '@/Components/Auth/AuthField';
import AuthShell from '@/Components/Auth/AuthShell';
import AuthSubmitButton from '@/Components/Auth/AuthSubmitButton';
import { Input } from '@/Components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthShell
            title="Create your account"
            subtitle="Start building an auditable pre-accounting workflow."
            footer={
                <p>
                    Already have an account?{' '}
                    <Link
                        href={route('login')}
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                        Log in
                    </Link>
                </p>
            }
        >
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-4">
                <AuthField id="name" label="Full name" error={errors.name}>
                    <Input
                        id="name"
                        autoComplete="name"
                        autoFocus
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        placeholder="Jane Al Mansouri"
                        required
                    />
                </AuthField>

                <AuthField id="email" label="Work email" error={errors.email}>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="username"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        placeholder="you@company.com"
                        required
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
                        autoComplete="new-password"
                        value={data.password}
                        onChange={(event) =>
                            setData('password', event.target.value)
                        }
                        required
                    />
                </AuthField>

                <AuthField
                    id="password_confirmation"
                    label="Confirm password"
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
                        required
                    />
                </AuthField>

                <AuthSubmitButton processing={processing}>
                    Create account
                </AuthSubmitButton>
            </form>
        </AuthShell>
    );
}
