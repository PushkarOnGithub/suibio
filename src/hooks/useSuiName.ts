import { useSuiClient } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to resolve a Sui address to its primary SuiNS name.
 * @param address The Sui address to resolve.
 * @returns Object containing the resolved name, loading state, and error state.
 */
export function useSuiName(address: string | undefined) {
    const client = useSuiClient();

    return useQuery({
        queryKey: ['sui-ns-name', address],
        queryFn: async () => {
            if (!address) return null;

            try {
                const { data } = await client.resolveNameServiceNames({
                    address: address,
                    limit: 1,
                });

                if (data && data.length > 0) {
                    return data[0];
                }
                return null;
            } catch (error) {
                console.error('Failed to resolve SuiNS name:', error);
                return null;
            }
        },
        enabled: !!address,
        staleTime: 1000 * 60 * 10, // 10 minutes cache
    });
}

/**
 * Formats a Sui address for display if no name is available.
 */
export function formatAddress(address: string) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
