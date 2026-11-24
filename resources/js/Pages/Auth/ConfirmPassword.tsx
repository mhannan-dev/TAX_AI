import AuthField from '@/Components/Auth/AuthField';
import AuthShell from '@/Components/Auth/AuthShell';
import AuthSubmitButton from '@/Components/Auth/AuthSubmitButton';
import { Input } from '@/Components/ui/input';
import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('password.confirm'), { onFinish: () => reset('password') });
    };

    return (
        <AuthShell
            title="Confirm it's you"
            subtitle="Please confirm your password before continuing."
        >
            <Head title="Confirm Password" />

            <form onSubmit={submit} className="space-y-4">
                <AuthField
                    id="password"
                    label="Password"
                    error={errors.password}
                >
                    <Input
                        id="password"
                        type="password"
                        autoFocus
                        autoComplete="current-password"
                        value={data.password}
                        onChange={(event) =>
                            setData('password', event.target.value)
                        }
                    />
                </AuthField>

                <AuthSubmitButton processing={processing}>
                    Confirm password
                </AuthSubmitButton>
            </form>
        </AuthShell>
    );
}
