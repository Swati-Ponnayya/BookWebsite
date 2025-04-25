
const Pagecover = ({ title }) => {

  return (
    <div
      className="w-full h-full bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/herobg5.png')" }}
    >

      {/* Main Content */}
      <div className="flex w-full mx-20 h-[300px] max-w-11/12">
        {/* Left Content */}
        <div className="w-1/2 pr-8 flex justify-center flex-col text-[#764932]">
          <h1 className="text-5xl font-bold mb-2">{title}</h1>
        </div>
      </div>
    </div>
  );
};

export default Pagecover;
