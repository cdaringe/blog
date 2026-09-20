import React from "react";

const Flame = (props) => (
  <img
    alt=""
    src="https://static.cdaringe.com/c/pub/img/flame.gif"
    {...props}
  />
);

const FireEyes = () => {
  const [isEyesBurning, setIsEyesBurning] = React.useState(false);
  React.useEffect(() => {
    const onsrcoll = () => setIsEyesBurning(true);
    const onscrolled = () => setIsEyesBurning(false);
    window.addEventListener("scroll", onsrcoll);
    window.addEventListener("scrollend", onscrolled);
    return () => {
      window.removeEventListener("scroll", onsrcoll);
      window.removeEventListener("scrollend", onscrolled);
    };
  }, []);
  return (
    <div style={{ position: "relative" }}>
      <a
        style={{ display: "inline-block", margin: "10px 0" }}
        className="img-link"
        href="https://static.cdaringe.com/c/pub/img/headshot.jpeg"
      >
        {isEyesBurning && (
          <>
            <Flame
              style={{
                position: "absolute",
                width: 35,
                height: 50,
                left: 28,
                top: 20,
              }}
            />
            <Flame
              style={{
                position: "absolute",
                width: 35,
                height: 50,
                left: 55,
                top: 18,
              }}
            />
          </>
        )}
        <img
          alt="cdaringe"
          onBlur={() => setIsEyesBurning(false)}
          onFocus={() => setIsEyesBurning(true)}
          onMouseOver={() => setIsEyesBurning(true)}
          onMouseOut={() => setIsEyesBurning(false)}
          style={{ borderRadius: 5, boxShadow: "0px 0px 15px 5px #ccc" }}
          src="https://static.cdaringe.com/c/pub/img/headshot.jpeg"
          className="img-frame float-right"
          width={150}
          height={150}
        />
      </a>
    </div>
  );
};

export default FireEyes;
