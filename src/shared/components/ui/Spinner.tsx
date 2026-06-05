interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'muted';
  className?: string;
}

const sizeMap = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-8 h-8 border-[3px]' };
const colorMap = {
  primary: 'border-primary-300 border-t-primary-600',
  white:   'border-white/30 border-t-white',
  muted:   'border-gray-200 border-t-gray-500',
};

export function Spinner({ size = 'md', color = 'primary', className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Cargando..."
      className={[
        'inline-block rounded-full spin-anim',
        sizeMap[size],
        colorMap[color],
        className,
      ].join(' ')}
    />
  );
}

export default Spinner;
