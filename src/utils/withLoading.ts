// utils/withLoading.ts
export function withLoading<T extends { isLoading: boolean }, R>(
    set: (partial: Partial<T>, replace?: boolean) => void,
    action: () => Promise<R>
): Promise<R> {
    set({ isLoading: true } as Partial<T>)
    return action()
        .then((result) => {
            set({ isLoading: false } as Partial<T>)
            return result
        })
        .catch((err) => {
            set({ isLoading: false } as Partial<T>)
            throw err
        })
}
