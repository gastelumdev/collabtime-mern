export interface TParticipant {
    _id?: any | null;
    name: string;
    email: string;
    status?: 'Pending' | 'Submitted' | 'Verified';
    street?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    band_director_name?: string;
    event?: string | null
}