import React from 'react';

const Digit: React.FC<{ digit: string }> = React.memo(({ digit }) => {
    const num = parseInt(digit, 10);
    // Each digit is 1em high, so we translate by -N em to show the Nth digit.
    const yOffset = num * -1; 
  
    return (
      <span
        className="inline-block transition-transform duration-700 ease-out"
        style={{ transform: `translateY(${yOffset}em)` }}
      >
        <span className="flex flex-col text-center">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="h-[1em] leading-[1em]">
              {i}
            </span>
          ))}
        </span>
      </span>
    );
});

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
    // Ensure value is an integer for simplicity
    const intValue = Math.floor(value);
    const digits = String(intValue).split('');
  
    return (
      <p
        className="flex font-mono text-2xl font-bold text-slate-900 dark:text-white"
        aria-live="polite"
        aria-atomic="true"
        aria-label={String(intValue)}
      >
        {digits.map((d, i) => (
            // This span creates the "window" for a single digit.
            // It's 1em high and hides the overflow of the scrolling column of numbers.
            <span key={i} className="h-[1em] overflow-hidden leading-[1em]">
                <Digit digit={d} />
            </span>
        ))}
      </p>
    );
};
  
export default AnimatedNumber;
