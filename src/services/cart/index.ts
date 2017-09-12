const itemOptionMapper = (option: app.store.GenericId): string => `${option.type}|${option.id}`;

export const isSameOptions = (
    optionsA: ReadonlyArray<app.store.GenericId>,
    optionsB: ReadonlyArray<app.store.GenericId>,
) => {
    if (optionsA.length !== optionsB.length) {
        return false;
    }

    const sortedAOptions = optionsA.map(itemOptionMapper).sort();
    const sortedBOptions = optionsB.map(itemOptionMapper).sort();

    return sortedAOptions.every((option, i) => sortedAOptions[i] === sortedAOptions[i]);
};


export const findIdentityItem = (
    options: ReadonlyArray<app.store.GenericId>,
    item: string,
    cart: string,
    store: app.store.ReadonlyIdStore<app.entity.CartItem>,
) => {
    const sortedOptions = options.map(itemOptionMapper).sort();

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
            cartItem.cart === cart &&
            hasSameOptions
        ;
    });
};
