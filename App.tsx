import React, { useContext } from 'react';
import { AppContextProvider, AppContext } from './context/AppContext';
import { View } from './types';
import Layout from './components/layout/Layout';

import HomeScreen from './views/HomeScreen';
import AppointmentsScreen from './views/AppointmentsScreen';
import MessagesScreen from './views/MessagesScreen';
import LibraryScreen from './views/LibraryScreen';
import TrackerScreen from './views/TrackerScreen';
import ChildProfileScreen from './views/ChildProfileScreen';
import NewAppointmentScreen from './views/NewAppointmentScreen';
import UrgentMessageScreen from './views/UrgentMessageScreen';
import PostConsultationFollowUpScreen from './views/PostConsultationFollowUpScreen';
import ConversationScreen from './views/ConversationScreen';

const viewComponents: { [key in View]: React.ComponentType } = {
  [View.Home]: HomeScreen,
  [View.Appointments]: AppointmentsScreen,
  [View.Messages]: MessagesScreen,
  [View.Library]: LibraryScreen,
  [View.Tracker]: TrackerScreen,
  [View.ChildProfile]: ChildProfileScreen,
  [View.NewAppointment]: NewAppointmentScreen,
  [View.UrgentMessage]: UrgentMessageScreen,
  [View.PostConsultationFollowUp]: PostConsultationFollowUpScreen,
  [View.Conversation]: ConversationScreen,
};

const CurrentView: React.FC = () => {
  const { activeView } = useContext(AppContext);
  const ComponentToRender = viewComponents[activeView] || HomeScreen;
  return <ComponentToRender />;
};

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-light font-sans max-w-lg mx-auto shadow-2xl relative overflow-hidden">
        <AppContextProvider>
            <Layout>
                <CurrentView />
            </Layout>
        </AppContextProvider>
    </div>
  );
};

export default App;
