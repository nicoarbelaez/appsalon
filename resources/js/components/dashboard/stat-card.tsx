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
}

export function StatCard({
    title,
    value,
    icon: Icon,
    iconClassName,
    valueClassName,
    description,
}: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className={cn('h-4 w-4 text-muted-foreground', iconClassName)} />
            </CardHeader>
            <CardContent>
                <p className={cn('text-3xl font-bold', valueClassName)}>{value}</p>
                {description && (
                    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}
