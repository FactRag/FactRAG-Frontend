export interface Triple {
    subject: string;
    predicate: string;
    object: string;
}

export interface SearchMatch {
    text: string;
    dataset: string;
    identifier: string;
    triple: Triple;
}