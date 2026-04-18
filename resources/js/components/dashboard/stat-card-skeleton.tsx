import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardSkeletonProps {
    count?: number;
}

export function StatCardSkeleton({ count = 4 }: StatCardSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-4 rounded-sm" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="mt-1 h-8 w-16" />
                    </CardContent>
                </Card>
            ))}
        </>
    );
}
