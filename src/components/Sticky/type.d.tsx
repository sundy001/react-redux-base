declare namespace app {
    namespace ui {
        type StickyEvent = {
            distanceFromTop: number;
            distanceFromBottom: number;
            eventSource: HTMLElement;
        };

        type StickyEventHandler = (event: StickyEvent) => void;
    }
}
