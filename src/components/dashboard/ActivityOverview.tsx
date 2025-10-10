import DentalHealthOverview from './DentalHealthOverview';
import NextAppointment from './NextAppointment';

function ActivityOverview() {
    return (
        <div className='grid lgL:grid-cols-3 gap-6'>
            <DentalHealthOverview />
            <NextAppointment />
        </div>
    )
}

export default ActivityOverview;