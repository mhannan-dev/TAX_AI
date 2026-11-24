import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';

import ActionToast from '@/Components/App/ActionToast';
import type { ToastFlash } from '@/types';

export default function FlashToast() {
    const flashToast = usePage().flash?.toast;
    const [visibleToast, setVisibleToast] = useState<ToastFlash | null>(
        flashToast ?? null,
    );
    const dismiss = useCallback(() => setVisibleToast(null), []);

    useEffect(() => {
        if (flashToast) {
            setVisibleToast(flashToast);
        }
    }, [flashToast]);

    return (
        <ActionToast
            message={visibleToast?.message ?? null}
            tone={visibleToast?.tone}
            onDismiss={dismiss}
        />
    );
}
