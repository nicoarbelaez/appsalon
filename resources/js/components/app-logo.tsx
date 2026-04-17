import { Scissors } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-rose-600 text-white">
                <Scissors className="size-4" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-bold leading-tight text-rose-600">
                    AppSalon
                </span>
            </div>
        </>
    );
}
