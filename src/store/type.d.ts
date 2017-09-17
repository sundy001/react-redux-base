declare namespace app {
    namespace entity {
        type LatLng = {
            lat: number;
            lng: number;
        };

        interface TimeOption extends store.Entity {
            name: string;
            date: Date;
        }

        interface DateOption extends store.Entity {
            name: string;
            date: Date;
        }

        interface CartItem extends store.Entity {
            readonly item: string;
            readonly cart: string;
            readonly quantity: number;
            readonly options: ReadonlyArray<store.GenericId>;
        }

        interface Cart extends store.Entity {
            readonly name: string;
            readonly owner: string;
        }

        interface Restaurant extends store.Entity {
            readonly name: string;
            readonly description: string;
            readonly priceLevel: number;
            readonly labels: ReadonlyArray<string>;
            readonly address: string;
            readonly phoneNumber: string;
            readonly latLng: LatLng;
            readonly logoURL: string | undefined;
            readonly categories: ReadonlyArray<string>;
        }

        interface Category extends store.Entity {
            readonly name: string;
            readonly description: string;
            readonly isActive: boolean;
            readonly products: ReadonlyArray<string>;
        }

        interface Product extends store.Entity {
            readonly name: string;
            readonly description: string;
            readonly restaurant: string;
            readonly imageURL: string | undefined;
            readonly price: number;
            readonly optionsGroups: ReadonlyArray<string>;
        }

        interface OptionGroup extends store.Entity {
            readonly name: string;
            readonly description: string;
            readonly options: ReadonlyArray<string>;
        }

        interface Option extends store.Entity {
            readonly name: string;
            readonly price: number;
        }

        interface User extends store.Entity {
            readonly email: string;
            readonly isAnonymous: boolean;
            readonly firstName: string;
            readonly lastName: string;
        }
    }

    namespace store {
        enum DeliveryType {
            Delivery = 'Delivery',
            Pickup = 'Pickup',
        }

        interface RootStore {
            readonly deliveryType: DeliveryType;
            readonly currentDate: string;
            readonly currentTime: string;
            readonly currentUser: string;
            readonly host: string;
            readonly guests: ReadonlyArray<string>;
            readonly currentCategory: string;
            readonly currentRestaurant: string;
            readonly currentCarts: ReadonlyArray<string>;

            readonly ui: {

            };

            readonly entity: {
                readonly categories: Store<entity.Category>;
                readonly products: Store<entity.Product>;
                readonly optionsGroups: Store<entity.OptionGroup>;
                readonly options: Store<entity.Option>;
                readonly restaurants: Store<entity.Restaurant>;
                readonly users: Store<entity.User>;
                readonly carts: Store<entity.Cart>;
                readonly cartItems: Store<entity.CartItem>;
                readonly dateOptions: Store<entity.DateOption>;
                readonly timeOptions: Store<entity.TimeOption>;
            };
        }

        type IdStore<T extends Entity> = {
            [id: string]: T;
        };

        type Store<T extends Entity> =  {
            byId: IdStore<T>;
            allIds: string[];
            idCounter: number;
        };

        type ReadonlyIdStore<T> = {
            readonly[id: string]: T;
        };

        type ReadonlyStore<T> =  {
            readonly byId: ReadonlyIdStore<T>;
            readonly allIds: ReadonlyArray<string>;
            readonly idCounter: number;
        };

        interface Entity {
            id: string;
        }

        interface GenericId {
            readonly type: string;
            readonly id: string;
        }
    }
}
