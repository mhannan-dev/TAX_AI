import type { ApprovalStatus, InvoiceStatus } from "@/types/domain";

export function formatCurrency(
    value: string | number | null | undefined,
    currency = "$",
): string {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    const amount = typeof value === "number" ? value : Number(value);

    if (!Number.isFinite(amount)) {
        return "—";
    }

    const normalizedCurrency =
        currency === "$" || !currency ? "USD" : currency;

    try {
        return new Intl.NumberFormat(
            normalizedCurrency === "AED" ? "en-AE" : "en-US",
            {
                style: "currency",
                currency: normalizedCurrency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            },
        ).format(amount);
    } catch {
        return `$${amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }
}

export function formatDate(value: string | null | undefined): string {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

export function formatDateTime(value: string | null | undefined): string {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function formatPercent(
    value: string | number | null | undefined,
    maximumFractionDigits = 2,
): string {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    const numeric = typeof value === "number" ? value : Number(value);

    if (!Number.isFinite(numeric)) {
        return "—";
    }

    return `${new Intl.NumberFormat("en-AE", {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(numeric)}%`;
}

export function humanize(value: string | null | undefined): string {
    if (!value) {
        return "—";
    }

    return value
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

export function invoiceStatusTone(
    status: InvoiceStatus | string,
): "success" | "warning" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "posted":
            return "success";
        case "pending_approval":
            return "warning";
        case "parsed":
            return "secondary";
        case "rejected":
            return "destructive";
        default:
            return "outline";
    }
}

export function approvalStatusTone(
    status: ApprovalStatus | string,
): "success" | "warning" | "destructive" {
    if (status === "approved") {
        return "success";
    }

    if (status === "rejected") {
        return "destructive";
    }

    return "warning";
}

export function confidencePercent(value: string | null | undefined): number {
    if (!value) {
        return 0;
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return 0;
    }

    return Math.round(numeric <= 1 ? numeric * 100 : numeric);
}
