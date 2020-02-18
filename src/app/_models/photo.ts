// This is a type script interface that represents our photo object that we are sending to the api
// When instantiating a type script interface, members must not be omitted

export interface Photo {

    id: number;
    url: string;
    description: string;
    dateAdded: Date;
    isMain: boolean;
    isApproved: boolean;
}
