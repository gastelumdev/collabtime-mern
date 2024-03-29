export interface TData {
    _id?: any | null;
    name: string;
    email: string;
    order_number: Number;
    division: string;
    performance_time: string;
    status?: 'Pending' | 'Submitted' | 'Verified';
    street?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    band_director_name?: string;
    band_director_phone?: string;
    band_director_email?: string;
    booster_parent_name?: string;
    booster_parent_phone?: string;
    booster_parent_email?: string;
    parade_march_title?: string;
    parade_march_composer?: string;
    additional_band_staff_names?: string;
    drum_major?: string;
    drum_major_name?: string;
    color_guard_advisor?: string;//
    color_guard_captains?: string;
    drill_team?: string;
    drill_team_advisor?: string;
    drill_team_captains?: string;//
    school_enrollment?: string;
    number_of_students_in_band?: string;
    number_of_students_in_color_guard?: string;
    number_of_students_in_drill_team?: string;
    number_of_buses?: string;
    number_of_box_trucks?: string;
    number_of_trailers?: string;
    number_of_tractor_trailer_rigs?: string;
    special_instructions?: string;
    event?: string | null;
}

export interface TCol {
    name: string;
    sortable: boolean;
    omit: boolean;
    dataForm?: boolean;
    dataFormPageNumber?: number;
}

export interface TPage {
    name: string;
    number: number;
}

// export interface tEvent {
//     id?: string | null;
//     name: string;
//     description: string;
// }