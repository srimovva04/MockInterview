import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const InterviewReminder = () => {
  const [reminder, setReminder] = useState(null);

  useEffect(() => {
    const checkTodayInterview = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('interview')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending');

      if (error) return;

      const matching = data.find((item) =>
        item.appointment?.startsWith(today)
      );

      if (matching) {
        const time = new Date(matching.appointment).toLocaleTimeString();
        setReminder(`You have a pending interview today at ${time}`);
      }
    };

    checkTodayInterview();
  }, []);

  if (!reminder) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-yellow-100 text-yellow-900 px-6 py-4 rounded-lg shadow-lg z-50">
      <strong>Reminder:</strong> {reminder}
    </div>
  );
};

export default InterviewReminder;



// import { useEffect, useState } from 'react';
// import { supabase } from '../utils/supabaseClient';

// const InterviewReminder = () => {
//   const [reminder, setReminder] = useState(null);

//   useEffect(() => {
//     const checkTodayInterview = async () => {
//       const today = new Date().toISOString().split('T')[0];

//       const { data, error } = await supabase
//         .from('interview')
//         .select('*');

//       if (error) return;

//       const matching = data.find((item) =>
//         item.appointment?.startsWith(today)
//       );

//       if (matching) {
//         setReminder(`You have a scheduled interview today at ${new Date(matching.appointment).toLocaleTimeString()}`);
//       }
//     };

//     checkTodayInterview();
//   }, []);

//   if (!reminder) return null;

//   return (
//     <div className="fixed bottom-6 right-6 bg-yellow-100 text-yellow-900 px-6 py-4 rounded-lg shadow-lg z-50">
//       <strong>Reminder:</strong> {reminder}
//     </div>
//   );
// };

// export default InterviewReminder;
