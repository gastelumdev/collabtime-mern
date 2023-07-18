/**
 * @role Parent feature
 * This feature will serve as a entry point to the application
 * once the user has logged in.
 * All configuration settings for this feature will be declared here
 */
const defaultData =  {
    name: 'events',
    singularName: 'event',
    defaultData: {
        _id: '',
        name: '',
        description: '',
        owner: ''
    },
    redirectComponent: "participants",
    parentFeature: null,
    formInputs: ['name', 'description']
}

export default defaultData;