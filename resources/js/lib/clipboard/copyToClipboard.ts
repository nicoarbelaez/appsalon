type ShareOrCopyOptions = {
    title?: string;
    useShare?: boolean;
    onSuccess?: (mode: 'share' | 'clipboard') => void;
    onError?: (error: unknown) => void;
};

function isMobile(): boolean {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}

async function copy(text: string) {
    const clipboard = navigator?.clipboard;

    if (!clipboard || typeof clipboard.writeText !== 'function') {
        throw new Error('Clipboard API not available');
    }

    await clipboard.writeText(text);
}

export async function shareOrCopy(text: string, options?: ShareOrCopyOptions) {
    const useShare = options?.useShare ?? true;

    try {
        // 🚫 fuerza clipboard
        if (!useShare) {
            await copy(text);
            options?.onSuccess?.('clipboard');
            return;
        }

        // 📱 share mobile
        if (isMobile() && navigator.share) {
            await navigator.share({
                title: options?.title ?? document.title,
                text,
            });

            options?.onSuccess?.('share');
            return;
        }

        // 💻 fallback clipboard
        await copy(text);
        options?.onSuccess?.('clipboard');
    } catch (err) {
        options?.onError?.(err);
    }
}
