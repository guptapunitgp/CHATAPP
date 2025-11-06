import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
  return (
    <div className="relative flex sm:h-[450px] md:h-[650px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      
      {/* Rotating background */}
      <div className="absolute inset-0 flex justify-center items-center z-0">
        <img
          src="/kpg.png"  // path to your golden wheel image
          alt="rotating-bg"
          className="w-96 h-96 opacity-20 animate-spin-slow"
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex w-full">
        <Sidebar />
        <MessageContainer />
      </div>
    </div>
  );
};

export default Home;
