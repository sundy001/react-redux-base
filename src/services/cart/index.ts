const itemOptionMapper = (option: app.store.GenericId): string => `${option.type}|${option.id}`;

export const findIdentityItem = (
    options: ReadonlyArray<app.store.GenericId>,
    item: string,
    owner: string,
    store: app.store.ReadonlyIdStore<app.entity.CartItem>
) => {
    const sortedOptions = options.map(itemOptionMapper).sort();
    // try to find identity item
    return Object.keys(store).find((itemId) => {
        const cartItem = store[itemId];
        let hasSameOptions = cartItem.options.length === options.length;
        if (hasSameOptions) {
            const sortedItemOptions = cartItem.options.map(itemOptionMapper).sort();

            hasSameOptions = sortedItemOptions.every((option, i) =>
                sortedItemOptions[i] === sortedOptions[i]
            );
        }

        return cartItem.item === item &&
            cartItem.owner === owner &&
            hasSameOptions
        ;
    });
};
