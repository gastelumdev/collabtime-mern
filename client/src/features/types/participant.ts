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
    event?: string | null
}