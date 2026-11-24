import { Save } from "lucide-react";
import type { FormEvent } from "react";

import ExtractedField from "@/Components/Invoices/ExtractedField";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export type ExtractedFields = {
    vendor_name: string;
    vendor_trn: string;
    invoice_date: string;
    subtotal: string;
    vat_amount: string;
    total: string;
    currency: string;
    tax_code: string;
};

type Props = {
    value: ExtractedFields;
    onChange: (fields: ExtractedFields) => void;
    onSave?: (fields: ExtractedFields) => void;
};

export default function ExtractedFieldsForm({
    value,
    onChange,
    onSave,
}: Props) {
    const update = (key: keyof ExtractedFields, fieldValue: string) => {
        onChange({ ...value, [key]: fieldValue });
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        onSave?.(value);
    };

    return (
        <Card>
            <CardHeader className="border-b bg-muted/30">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-base">
                            Extracted fields
                        </CardTitle>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Vision model output, validated before posting.
                        </p>
                    </div>
                    <Button type="submit" form="extracted-fields" size="sm">
                        <Save className="h-3.5 w-3.5" />
                        Apply
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-5">
                <form
                    id="extracted-fields"
                    onSubmit={submit}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                    <ExtractedField label="Vendor name" htmlFor="vendor_name">
                        <Input
                            id="vendor_name"
                            value={value.vendor_name}
                            onChange={(event) =>
                                update("vendor_name", event.target.value)
                            }
                            autoComplete="off"
                        />
                    </ExtractedField>

                    <ExtractedField
                        label="Vendor TRN"
                        htmlFor="vendor_trn"
                        hint={
                            value.vendor_trn.replace(/\D/g, "").length === 15
                                ? "15 digits detected"
                                : "15 digits required for UAE suppliers"
                        }
                    >
                        <Input
                            id="vendor_trn"
                            value={value.vendor_trn}
                            onChange={(event) =>
                                update("vendor_trn", event.target.value)
                            }
                            aria-invalid={
                                value.vendor_trn.replace(/\D/g, "").length !==
                                15
                            }
                            autoComplete="off"
                        />
                    </ExtractedField>

                    <ExtractedField label="Invoice date" htmlFor="invoice_date">
                        <Input
                            id="invoice_date"
                            type="date"
                            value={value.invoice_date}
                            onChange={(event) =>
                                update("invoice_date", event.target.value)
                            }
                        />
                    </ExtractedField>

                    <ExtractedField label="Currency" htmlFor="currency">
                        <Select
                            value={value.currency}
                            onValueChange={(currency) =>
                                update("currency", currency)
                            }
                        >
                            <SelectTrigger id="currency">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="$">$</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="BDT">BDT</SelectItem>
                            </SelectContent>
                        </Select>
                    </ExtractedField>

                    <ExtractedField label="Subtotal" htmlFor="subtotal">
                        <Input
                            id="subtotal"
                            inputMode="decimal"
                            value={value.subtotal}
                            onChange={(event) =>
                                update("subtotal", event.target.value)
                            }
                        />
                    </ExtractedField>

                    <ExtractedField label="VAT amount" htmlFor="vat_amount">
                        <Input
                            id="vat_amount"
                            inputMode="decimal"
                            value={value.vat_amount}
                            onChange={(event) =>
                                update("vat_amount", event.target.value)
                            }
                        />
                    </ExtractedField>

                    <ExtractedField
                        label="Total"
                        htmlFor="total"
                        hint="Deterministic checks run below"
                    >
                        <Input
                            id="total"
                            inputMode="decimal"
                            value={value.total}
                            onChange={(event) =>
                                update("total", event.target.value)
                            }
                        />
                    </ExtractedField>

                    <ExtractedField label="Tax code" htmlFor="tax_code">
                        <Select
                            value={value.tax_code}
                            onValueChange={(taxCode) =>
                                update("tax_code", taxCode)
                            }
                        >
                            <SelectTrigger id="tax_code">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="standard">
                                    Standard 5%
                                </SelectItem>
                                <SelectItem value="zero-rated">
                                    Zero-rated
                                </SelectItem>
                                <SelectItem value="exempt">Exempt</SelectItem>
                            </SelectContent>
                        </Select>
                    </ExtractedField>
                </form>
            </CardContent>
        </Card>
    );
}
