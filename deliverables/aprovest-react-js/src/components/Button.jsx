export function Button({ variant = 'primary', children, ...props }) {
  return (
    <button className={`btn ${variant}`} type="button" {...props}>
      {children}
    </button>
  );
}