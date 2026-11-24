import { useForm } from "@inertiajs/react";
import { Building2, LoaderCircle, Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import type { Organization } from "@/types/domain";

export interface WorkspacePreferences {
    approval_notifications: boolean;
    processing_failure_notifications: boolean;
    audit_digest: boolean;
}

export default function OrganizationCard({
    organization,
    updateUrl,
    preferences,
}: {
    organization: Organization | null;
    updateUrl?: string;
    preferences?: WorkspacePreferences;
}) {
    const form = useForm({
        name: organization?.name ?? "",
        trn: organization?.trn ?? "",
        currency: organization?.currency ?? "$",
        default_vat_rate: organization?.default_vat_rate ?? "5.00",
        approval_notifications: preferences?.approval_notifications ?? false,
        processing_failure_notifications:
            preferences?.processing_failure_notifications ?? false,
        audit_digest: preferences?.audit_digest ?? false,
    });
    const [feedback, setFeedback] = useState<string | null>(null);
    const validate = () => {
        form.clearErrors();
        let valid = true;
        if (!form.data.name.trim()) {
            form.setError("name", "Enter the legal organization name.");
            valid = false;
        }
        if (form.data.trn && !/^\d{15}$/.test(form.data.trn)) {
            form.setError(
                "trn",
                "Enter 15 digits, or leave blank if no TRN is registered.",
            );
            valid = false;
        }
        const rate = Number(form.data.default_vat_rate);
        if (
            form.data.default_vat_rate === "" ||
            !Number.isFinite(rate) ||
            rate < 0 ||
            rate > 100
        ) {
            form.setError(
                "default_vat_rate",
                "Enter a VAT rate between 0 and 100.",
            );
            valid = false;
        }
        return valid;
    };
    const submit = (event: FormEvent) => {
        event.preventDefault();
        setFeedback(null);
        if (form.processing || !validate()) {
            return;
        }
        if (!updateUrl) {
            setFeedback(
                "Draft validated. Changes have not been saved because workspace updates are unavailable.",
            );
            return;
        }
        form.patch(updateUrl, {
            preserveScroll: true,
            onSuccess: () => {
                form.setDefaults();
                setFeedback("Workspace settings saved.");
            },
            onError: () =>
                setFeedback(
                    "Settings could not be saved. Review the highlighted fields.",
                ),
        });
    };
    const fields = [
        {
            key: "name",
            label: "Legal organization name",
            type: "text",
            required: true,
        },
        {
            key: "trn",
            label: "UAE Tax Registration Number (TRN)",
            type: "text",
            required: false,
        },
        {
            key: "default_vat_rate",
            label: "Default VAT rate (%)",
            type: "number",
            required: true,
        },
    ] as const;
    const toggles = [
        {
            key: "approval_notifications",
            label: "Approval requests",
            help: "Notify me when a proposal needs human review.",
        },
        {
            key: "processing_failure_notifications",
            label: "Processing failures",
            help: "Notify me when a document needs attention.",
        },
        {
            key: "audit_digest",
            label: "Audit activity digest",
            help: "Receive a summary of recorded approval decisions.",
        },
    ] as const;

    return (
        <Card id="organization" className="scroll-mt-24">
            <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="h-5 w-5" />
                    Organization profile
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    Tax defaults for your workspace. Review changes before
                    saving.
                </p>
            </CardHeader>
            <CardContent className="pt-5">
                <form
                    onSubmit={submit}
                    noValidate
                    className="space-y-6"
                    aria-busy={form.processing}
                >
                    {!updateUrl && (
                        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                            Workspace updates are currently unavailable. You can
                            prepare and validate a draft; changes are not saved.
                        </p>
                    )}
                    <fieldset
                        disabled={form.processing}
                        className="grid gap-4 sm:grid-cols-2"
                    >
                        {fields.map(({ key, label, type, required }) => (
                            <div
                                key={key}
                                className={
                                    key === "name"
                                        ? "space-y-2 sm:col-span-2"
                                        : "space-y-2"
                                }
                            >
                                <Label htmlFor={`settings-${key}`}>
                                    {label}
                                </Label>
                                <Input
                                    id={`settings-${key}`}
                                    type={type}
                                    value={form.data[key]}
                                    required={required}
                                    maxLength={key === "trn" ? 15 : 255}
                                    inputMode={
                                        key === "trn" ? "numeric" : undefined
                                    }
                                    min={type === "number" ? 0 : undefined}
                                    max={type === "number" ? 100 : undefined}
                                    step={
                                        type === "number" ? "0.01" : undefined
                                    }
                                    onChange={(event) => {
                                        form.setData(key, event.target.value);
                                        form.clearErrors(key);
                                        setFeedback(null);
                                    }}
                                    aria-invalid={!!form.errors[key]}
                                    aria-describedby={
                                        form.errors[key]
                                            ? `${key}-error`
                                            : undefined
                                    }
                                />
                                {form.errors[key] && (
                                    <p
                                        id={`${key}-error`}
                                        role="alert"
                                        className="text-xs text-destructive"
                                    >
                                        {form.errors[key]}
                                    </p>
                                )}
                            </div>
                        ))}
                        <div className="space-y-2">
                            <Label htmlFor="settings-currency">
                                Default currency
                            </Label>
                            <select
                                id="settings-currency"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={form.data.currency}
                                onChange={(event) => {
                                    form.setData(
                                        "currency",
                                        event.target.value,
                                    );
                                    setFeedback(null);
                                }}
                                aria-invalid={!!form.errors.currency}
                                aria-describedby={
                                    form.errors.currency
                                        ? "currency-error"
                                        : undefined
                                }
                            >
                                {Array.from(
                                    new Set(
                                        [
                                            "$",
                                            "USD",
                                            "BDT",
                                            organization?.currency,
                                        ].filter(
                                            (value): value is string => !!value,
                                        ),
                                    ),
                                ).map((currency) => (
                                    <option key={currency} value={currency}>
                                        {currency}
                                    </option>
                                ))}
                            </select>
                            {form.errors.currency && (
                                <p
                                    id="currency-error"
                                    role="alert"
                                    className="text-xs text-destructive"
                                >
                                    {form.errors.currency}
                                </p>
                            )}
                        </div>
                    </fieldset>
                    <fieldset
                        id="preferences"
                        disabled={form.processing}
                        className="scroll-mt-24 space-y-4 border-t pt-5"
                    >
                        <legend className="px-1 text-sm font-semibold">
                            Audit and notifications
                        </legend>
                        <p className="text-xs leading-5 text-muted-foreground">
                            Approval attribution is required and cannot be
                            disabled here.{" "}
                            {preferences
                                ? "Review your notification preferences below."
                                : "Saved notification preferences are unavailable. These selections are draft preferences."}
                        </p>
                        {toggles.map(({ key, label, help }) => (
                            <div
                                key={key}
                                className="flex items-start justify-between gap-4"
                            >
                                <div>
                                    <Label htmlFor={`settings-${key}`}>
                                        {label}
                                    </Label>
                                    <p
                                        id={`${key}-help`}
                                        className="mt-1 text-xs text-muted-foreground"
                                    >
                                        {help}
                                    </p>
                                    {form.errors[key] && (
                                        <p
                                            role="alert"
                                            className="text-xs text-destructive"
                                        >
                                            {form.errors[key]}
                                        </p>
                                    )}
                                </div>
                                <Switch
                                    id={`settings-${key}`}
                                    checked={form.data[key]}
                                    aria-describedby={`${key}-help`}
                                    onCheckedChange={(checked) => {
                                        form.setData(key, checked);
                                        setFeedback(null);
                                    }}
                                />
                            </div>
                        ))}
                    </fieldset>
                    <div className="flex flex-wrap gap-2 border-t pt-4">
                        <Button
                            type="submit"
                            disabled={form.processing || !organization}
                        >
                            {form.processing ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {form.processing
                                ? "Saving…"
                                : updateUrl
                                  ? "Save settings"
                                  : "Validate draft"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={form.processing || !form.isDirty}
                            onClick={() => {
                                form.reset();
                                form.clearErrors();
                                setFeedback(null);
                            }}
                        >
                            Discard changes
                        </Button>
                        {form.isDirty && (
                            <span className="self-center text-xs text-amber-700">
                                Unsaved changes
                            </span>
                        )}
                    </div>
                    {!organization && (
                        <p
                            role="status"
                            className="text-sm text-muted-foreground"
                        >
                            No organization is connected to this workspace.
                        </p>
                    )}
                    {feedback && (
                        <p
                            role="status"
                            className="text-sm text-muted-foreground"
                        >
                            {feedback}
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
