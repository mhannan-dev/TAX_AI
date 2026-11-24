import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
    ({ className, type, ...props }, ref) => {
        const [passwordVisible, setPasswordVisible] = React.useState(false);
        const generatedId = React.useId();
        const inputId = props.id ?? generatedId;
        const isPassword = type === 'password';

        React.useEffect(() => {
            if (props.value === '' || type !== 'password') {
                setPasswordVisible(false);
            }
        }, [props.value, type]);

        const input = (
            <input
                {...props}
                id={inputId}
                type={isPassword && passwordVisible ? 'text' : type}
                className={cn(
                    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                    isPassword && 'pr-10',
                )}
                ref={ref}
            />
        );

        if (!isPassword) {
            return input;
        }

        return (
            <div className="relative w-full">
                {input}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                    aria-controls={inputId}
                    aria-pressed={passwordVisible}
                    disabled={props.disabled}
                    onClick={() => setPasswordVisible((visible) => !visible)}
                >
                    {passwordVisible ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                </Button>
            </div>
        );
    },
);
Input.displayName = 'Input';

export { Input };
