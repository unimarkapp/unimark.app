import { Loader2 } from 'lucide-react';
import { cn } from '../lib';
import { useSpinDelay } from 'spin-delay';

interface Props {
  isFetchingNextPage: boolean;
  isRefetching: boolean;
}

export function FetchingIndicator({ isFetchingNextPage, isRefetching }: Props) {
  const delayedPending = useSpinDelay(isFetchingNextPage || isRefetching, {
    delay: 100,
    minDuration: 400,
  });
  return (
    <div
      className={cn(
        'fixed bottom-4 left-[50%] flex -translate-x-[50%] items-center gap-2 rounded-full border bg-background/50 p-2 pr-3 shadow backdrop-blur-sm transition-transform duration-200',
        delayedPending ? 'translate-y-0' : 'translate-y-[calc(100%_+_1rem)]',
      )}
    >
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm font-semibold">{isRefetching ? 'Refreshing...' : 'Loading...'}</span>
    </div>
  );
}
