import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { formatCurrency, humanize } from '@/lib/format';
import type { InvoiceItem } from '@/types/domain';

type EditableKey =
    | 'description'
    | 'quantity'
    | 'unit_price'
    | 'tax_code'
    | 'total';

type Props = {
    items: InvoiceItem[];
    currency: string;
    onChange: (items: InvoiceItem[]) => void;
};

export default function LineItemsTable({ items, currency, onChange }: Props) {
    const updateItem = (id: number, key: EditableKey, value: string) => {
        onChange(
            items.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                if (key === 'quantity' || key === 'unit_price') {
                    const quantity = key === 'quantity' ? value : item.quantity;
                    const unitPrice =
                        key === 'unit_price' ? value : item.unit_price;
                    const calculatedTotal =
                        (Number(quantity) || 0) * (Number(unitPrice) || 0);

                    return {
                        ...item,
                        [key]: value,
                        total: calculatedTotal.toFixed(2),
                    };
                }

                return { ...item, [key]: value };
            }),
        );
    };

    const addItem = () => {
        const nextId =
            Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1;

        onChange([
            ...items,
            {
                id: nextId,
                description: '',
                quantity: '1',
                unit_price: '0.00',
                tax_code: 'standard',
                tax_amount: '0.00',
                total: '0.00',
            },
        ]);
    };

    const removeItem = (id: number) => {
        onChange(items.filter((item) => item.id !== id));
    };

    const itemsTotal = items.reduce(
        (total, item) => total + (Number(item.total) || 0),
        0,
    );

    const taxCodeSelect = (item: InvoiceItem, label: string) => (
        <Select
            value={item.tax_code}
            onValueChange={(value) => updateItem(item.id, 'tax_code', value)}
        >
            <SelectTrigger className="h-8 w-full" aria-label={label}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="zero-rated">Zero-rated</SelectItem>
                <SelectItem value="exempt">Exempt</SelectItem>
            </SelectContent>
        </Select>
    );

    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead>Description</TableHead>
                            <TableHead className="w-20 text-right">
                                Qty
                            </TableHead>
                            <TableHead className="w-32 text-right">
                                Unit price
                            </TableHead>
                            <TableHead className="w-36">Tax code</TableHead>
                            <TableHead className="w-32 text-right">
                                Amount
                            </TableHead>
                            <TableHead className="w-10">
                                <span className="sr-only">Remove</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Input
                                        value={item.description}
                                        onChange={(event) =>
                                            updateItem(
                                                item.id,
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                        className="h-8"
                                        aria-label={`Description for line ${index + 1}`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={item.quantity}
                                        onChange={(event) =>
                                            updateItem(
                                                item.id,
                                                'quantity',
                                                event.target.value,
                                            )
                                        }
                                        inputMode="decimal"
                                        className="h-8 text-right"
                                        aria-label={`Quantity for line ${index + 1}`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={item.unit_price}
                                        onChange={(event) =>
                                            updateItem(
                                                item.id,
                                                'unit_price',
                                                event.target.value,
                                            )
                                        }
                                        inputMode="decimal"
                                        className="h-8 text-right"
                                        aria-label={`Unit price for line ${index + 1}`}
                                    />
                                </TableCell>
                                <TableCell>
                                    {taxCodeSelect(
                                        item,
                                        `Tax code for line ${index + 1}`,
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={item.total}
                                        onChange={(event) =>
                                            updateItem(
                                                item.id,
                                                'total',
                                                event.target.value,
                                            )
                                        }
                                        inputMode="decimal"
                                        className="h-8 text-right"
                                        aria-label={`Amount for line ${index + 1}`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeItem(item.id)}
                                        aria-label={`Remove line ${index + 1}`}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="space-y-3 md:hidden">
                {items.map((item, index) => (
                    <div key={item.id} className="space-y-3 rounded-lg border p-3">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-medium text-foreground">
                                Line {index + 1}
                            </p>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => removeItem(item.id)}
                                aria-label={`Remove line ${index + 1}`}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                        <Input
                            value={item.description}
                            onChange={(event) =>
                                updateItem(
                                    item.id,
                                    'description',
                                    event.target.value,
                                )
                            }
                            placeholder="Description"
                            className="h-8"
                            aria-label={`Description for line ${index + 1}`}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                value={item.quantity}
                                onChange={(event) =>
                                    updateItem(
                                        item.id,
                                        'quantity',
                                        event.target.value,
                                    )
                                }
                                inputMode="decimal"
                                className="h-8"
                                aria-label={`Quantity for line ${index + 1}`}
                            />
                            <Input
                                value={item.unit_price}
                                onChange={(event) =>
                                    updateItem(
                                        item.id,
                                        'unit_price',
                                        event.target.value,
                                    )
                                }
                                inputMode="decimal"
                                className="h-8"
                                aria-label={`Unit price for line ${index + 1}`}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {taxCodeSelect(
                                item,
                                `Tax code for line ${index + 1}`,
                            )}
                            <Input
                                value={item.total}
                                onChange={(event) =>
                                    updateItem(
                                        item.id,
                                        'total',
                                        event.target.value,
                                    )
                                }
                                inputMode="decimal"
                                className="h-8"
                                aria-label={`Amount for line ${index + 1}`}
                            />
                        </div>
                        <p className="text-right text-[11px] text-muted-foreground">
                            {humanize(item.tax_code)} ·{' '}
                            {formatCurrency(item.total, currency)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 border-t px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                >
                    <Plus className="h-3.5 w-3.5" />
                    Add line
                </Button>
                <p className="text-xs text-muted-foreground">
                    Line total{' '}
                    <span className="font-semibold text-foreground">
                        {formatCurrency(itemsTotal, currency)}
                    </span>
                </p>
            </div>
        </div>
    );
}
