import { useState } from "react";
import styles from "./Star.module.css";

export default function Star({ checked, onChange, size = 32 }) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(false);

  const active = isControlled ? checked : internal;

  function toggle() {
    if (!isControlled) setInternal(!internal);
    onChange?.(!active);
  }

  return (
    <button
      className={`${styles.star} ${active ? styles.active : ""}`}
      style={{ "--size": `${size}px` }}
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? "Quitar favorito" : "Marcar como favorito"}
    />
  );
}