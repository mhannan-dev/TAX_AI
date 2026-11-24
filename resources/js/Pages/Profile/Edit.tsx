import AppShell from '@/Components/App/AppShell';
import PageHeading from '@/Components/App/PageHeading';
import { Head } from '@inertiajs/react';

import type { PageProps } from '@/types';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AppShell
            title="Profile"
            description="Manage your account and security settings."
        >
            <Head title="Profile" />

            <PageHeading
                eyebrow="Account"
                title="Your profile"
                description="Keep your identity and password up to date."
            />

            <div className="grid gap-6 xl:grid-cols-2">
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                />
                <UpdatePasswordForm />
            </div>
        </AppShell>
    );
}
