declare namespace app {
    namespace entity {
        interface CartItem extends store.Entity {
            readonly item: string;
            readonly owner: string;
            readonly quantity: number;
            readonly options: ReadonlyArray<store.GenericId>;
        }
    }
}
