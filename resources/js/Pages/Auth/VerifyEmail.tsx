import AuthAlert from '@/Components/Auth/AuthAlert';
import AuthShell from '@/Components/Auth/AuthShell';
import AuthSubmitButton from '@/Components/Auth/AuthSubmitButton';
import { Button } from '@/Components/ui/button';
import { Head, Link, router, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthShell
            title="Verify your email"
            subtitle="Check your inbox for the verification link we sent."
            footer={
                <Button
                    variant="link"
                    className="h-auto p-0"
                    onClick={() => router.post(route('logout'))}
                >
                    Log out
                </Button>
            }
        >
            <Head title="Email Verification" />

            <div className="space-y-5">
                <AuthAlert
                    message={
                        status === 'verification-link-sent'
                            ? 'A new verification link has been sent.'
                            : undefined
                    }
                />

                <form onSubmit={submit}>
                    <AuthSubmitButton processing={processing}>
                        Resend verification email
                    </AuthSubmitButton>
                </form>

                <p className="text-xs text-muted-foreground">
                    Need to use another account?{' '}
                    <Link href={route('login')} className="font-medium text-foreground">
                        Back to log in
                    </Link>
                </p>
            </div>
        </AuthShell>
    );
}
