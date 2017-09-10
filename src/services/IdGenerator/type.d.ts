declare namespace app {
    namespace services {
        interface IdGeneratorInterface {
            generate(entityName: string): string;
        }
    }
}
