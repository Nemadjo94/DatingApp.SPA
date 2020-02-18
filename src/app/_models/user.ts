import { Photo } from './Photo';

// This is a type script interface that represents our user object that we are sending to the api
// When instantiating a type script interface, members must not be omitted

export interface User {
    id: number;
    userName: string;
    knownAs: string;
    age: number;
    gender: string;
    created: Date;
    lastActive: Date;
    photoUrl: string;
    city: string;
    country: string;
    interests?: string;
    introduction?: string;
    lookingFor?: string;
    photos?: Photo[];
    roles?: string[];
}
