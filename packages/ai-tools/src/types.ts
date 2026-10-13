


interface Tools<I, O> {
    execute: (input: I) => Promise<O>;
}

