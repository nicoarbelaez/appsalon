import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    iconClassName?: string;
    valueClassName?: string;
    description?: string;
    className?: string;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    iconClassName,
    valueClassName,
    description,
    className,
}: StatCardProps) {
    return (
        <Card className={cn('flex h-full flex-col', className)}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-sm leading-tight font-medium text-muted-foreground">
                    {title}
                </CardTitle>

                <Icon
                    className={cn(
                        'h-4 w-4 shrink-0 text-muted-foreground',
                        iconClassName,
                    )}
                />
            </CardHeader>

            <CardContent className="flex flex-1 flex-col pt-0">
                <div className="flex-1" />

                <p
                    className={cn(
                        'text-2xl leading-none font-bold sm:text-3xl',
                        valueClassName,
                    )}
                >
                    {value}
                </p>

                {description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
