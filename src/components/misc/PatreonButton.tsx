const PatreonButton = ({ border }: { border?: boolean }) => {
  return (
    <a
      className="btn btn-sm"
      target="_blank"
      rel="noreferrer"
      href="https://www.patreon.com/bePatron?u=91627284"
      style={{}}
    >
      <img
        style={{
          border: border ? "1px solid white" : "none",
          height: "2rem",
        }}
        src="https://c5.patreon.com/external/logo/become_a_patron_button.png"
        alt="Become a Patron!"
      />
    </a>
  );
};

export default PatreonButton;
