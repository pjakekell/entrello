import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

interface IFormattedDuration {
  value: number;
  countdown?: boolean;
}

const FormattedDuration = ({
  value,
  countdown = false,
}: IFormattedDuration) => {
  const { formatNumber: n } = useIntl();
  const [v, setV] = useState(value);

  let sec = 0;
  let min = 0;
  let durationHours = 0;
  let durationMinutes = 0;
  let durationSeconds = 0;

  const updateDuration = () => {
    const diff = v - new Date().getTime();
    sec = 0;
    min = 0;
    durationHours = 0;
    durationMinutes = 0;
    durationSeconds = 0;
    if (diff <= 0) return;

    sec = Math.floor(diff / 1000);
    min = Math.floor(sec / 60);
    durationHours = Math.floor(min / 60);
    durationMinutes = min % 60;
    durationSeconds = sec % 60;
  };

  useEffect(() => {
    if (!countdown) return;

    const interval = setInterval(() => {
      setV(v + 1); // add 1 microsecond to change value and trigger rerender
    }, 1000);
    return () => clearInterval(interval);
  });

  updateDuration();

  const unitDisplay = "short";

  let h = n(durationHours, {
    style: "unit",
    unit: "hour",
    unitDisplay,
  });
  let m = n(durationMinutes, {
    style: "unit",
    unit: "minute",
    unitDisplay,
  });
  let s = n(durationSeconds, {
    style: "unit",
    unit: "second",
    unitDisplay,
  });

  return (
    <>
      <span className="pr-1">{durationHours > 0 ? h : null}</span>
      <span className="pr-1">{durationMinutes > 0 ? m : null}</span>
      <span className="pr-1">{s}</span>
    </>
  );
};

export default FormattedDuration;
